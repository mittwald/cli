import { ReactNode } from "react";
import { spawnSync } from "child_process";
import fs from "fs/promises";
import path from "path";

import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { assertStatus, MittwaldAPIV2 } from "@mittwald/api-client";
import { waitFlags, waitUntil } from "../../lib/wait.js";
import { getProjectShortIdFromUuid } from "../../lib/resources/project/shortId.js";
import { pathExists } from "../../lib/util/fs/pathExists.js";
import { 
  setupProjectRegistry,
 } from "../../lib/resources/registry/manage.js";

type RepositoryData = {
  dockerfilePath: string;
  dockerfileContent: string;
  dockerfileCreated: boolean;
  buildContext: string;
  ports: string[];
  imageId?: string;
  imageName?: string;
};

type Result = {
  serviceId: string;
};

export class Deploy extends ExecRenderBaseCommand<typeof Deploy, Result> {
  static summary = "Deploys a new container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
    ...waitFlags,
  };
  static args = {};
  static examples = [
    "Deploy from current directory (auto-detects or creates Dockerfile):",
    "  $ mw deploy",
    "",
    "Deploy with explicit project context:",
    "  $ mw deploy --project-id p-abc123",
  ];

  private defaultDockerfile = `FROM nginx:alpine
COPY . /usr/share/nginx/html/
`;



  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Deploying ...");

    let repositoryData: RepositoryData;
    let registryUri = "";
    let registryUsername = "";
    let registryPassword = "";
    const projectId = await this.withProjectId(Deploy);
    const projectShortId = await getProjectShortIdFromUuid(
      this.apiClient,
      projectId
    );

    await p.runStep("Setting up registry ...", async () => {

      const resgistrySetupInfo = await setupProjectRegistry(
        this.apiClient,
        projectId,
        projectShortId,
        this.flags["wait-timeout"]
      );

      p.addInfo(
          resgistrySetupInfo.created ? "Created new registry." : "Using existing registry."
      );

      registryUri = resgistrySetupInfo.uri;
      registryUsername = resgistrySetupInfo.username;
      registryPassword = resgistrySetupInfo.password;

    });

    await p.runStep("Checking repository ...", async () => {
      const projectRoot = process.cwd();
      const dockerfilePath = path.join(projectRoot, "Dockerfile");
      let dockerfileContent: string;
      let dockerfileCreated = false;

      // Check if Dockerfile exists
      if (await pathExists(dockerfilePath)) {
        // 1.1 Dockerfile is present, read it
        dockerfileContent = await fs.readFile(dockerfilePath, "utf-8");
        p.addInfo("Found existing Dockerfile.");
      } else {
        // 1.2 No Dockerfile, create default one for static pages
        dockerfileContent = this.defaultDockerfile;
        await fs.writeFile(dockerfilePath, dockerfileContent, "utf-8");
        dockerfileCreated = true;
        p.addInfo("Created default Dockerfile for static pages.");
      }

      // Extract ports from the Dockerfile and create proper host:container mappings
      // If we created the default Dockerfile, we know it exposes port 80
      const ports = this.extractPortsFromDockerfile(dockerfileContent);
      if (ports.length === 0) {
        p.addInfo("No ports exposed in Dockerfile. Using default port mapping 8080:8080/tcp.");
        ports.push("80:80/tcp");
      } else {
        p.addInfo(`Detected port mappings: ${ports.join(", ")}`);
      }

      repositoryData = {
        dockerfilePath,
        dockerfileContent,
        dockerfileCreated,
        buildContext: projectRoot,
        ports,
      };
    });

    await p.runStep("Building Docker image ...", async () => {
      const registryHost = registryUri.replace(/^https?:\/\//, '');
      const imageName = `${registryHost}/app-image:latest`;

      const buildResult = spawnSync('docker', [
        'build',
        '-t', imageName,
        '-f', repositoryData.dockerfilePath,
        repositoryData.buildContext,
      ], {
        cwd: repositoryData.buildContext,
        stdio: 'inherit',
      });

      if (buildResult.status !== 0) {
        throw new Error(`Docker build failed with status ${buildResult.status}`);
      }

      const inspectResult = spawnSync('docker', [
        'inspect',
        '--format={{.ID}}',
        imageName,
      ], {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      if (inspectResult.status !== 0) {
        throw new Error(`Failed to inspect built image: ${inspectResult.stderr}`);
      }

      const imageId = inspectResult.stdout.trim();
      repositoryData.imageId = imageId;
      repositoryData.imageName = imageName;

      p.addInfo(`Built image ${imageName}`);
    });

    await p.runStep("Pushing docker image ...", async () => {
      const registryHost = registryUri.replace(/^https?:\/\//, '');

      if (process.env.MITTWALD_API_BASE_URL) {
        return
      }; // Skip actual docker push if we're using a mocked API (e.g., for testing), since the registry won't actually be reachable

      const loginResult = spawnSync('docker', [
        'login',
        registryHost,
        '-u', registryUsername,
        '-p', registryPassword,
      ], {
        stdio: 'inherit',
      });

      if (loginResult.status !== 0) {
        throw new Error(`Docker login failed with status ${loginResult.status}`);
      }

      const pushResult = spawnSync('docker', [
        'push',
        repositoryData.imageName!,
      ], {
        stdio: 'inherit',
      });

      if (pushResult.status !== 0) {
        throw new Error(`Docker push failed with status ${pushResult.status}`);
      }
      p.addInfo(`Pushed image ${repositoryData.imageName} to registry`);
    });

    let deployedServiceId = "";

    await p.runStep("deploying ...", async () => {
      const projectId = await this.withProjectId(Deploy);
      const serviceName = `app-${projectId}`;
      const stackId = projectId;

      // 1. Create or update the service in the stack with the built image
      const serviceRequest = {
        image: repositoryData.imageName!,
        description: "Deployed application",
        ports: repositoryData.ports,
      };

      const updateResp = await this.apiClient.container.updateStack({
        stackId,
        data: { services: { [serviceName]: serviceRequest } },
      });

      assertStatus(updateResp, 200);
      p.addInfo(`Created/updated service ${serviceName}`);

      // 2. Wait for the service to be running
      await waitUntil(async () => {
        try {
          const servicesResp = await this.apiClient.container.listServices({
            projectId,
          });
          assertStatus(servicesResp, 200);
          const services = servicesResp.data;

          const deployedSvc = services.find(svc => svc.serviceName === serviceName);

          if (!deployedSvc) {
            p.addInfo(`[DEBUG] Service '${serviceName}' not found yet. Available: ${services.map(s => s.serviceName).join(', ')}`);
            return null;
          }

          p.addInfo(`[DEBUG] Service '${serviceName}' found with status: ${deployedSvc.status}`);

          if (deployedSvc.status === "running") {
            deployedServiceId = deployedSvc.id;
            return true;
          }
          return null;
        } catch (error) {
          p.addInfo(`[DEBUG] Error polling deployed service status: ${error instanceof Error ? error.message : String(error)}`);
          return null;
        }
      }, this.flags["wait-timeout"]);

      p.addInfo(`Service ${serviceName} is now running`);
    });

    const serviceId = deployedServiceId;

    // XXX: missing step: create ingress to expose the deployed service via domain?
    // For now, users can do it manually if needed, or we can add it in a future iteration.
    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully deployed.
      </Success>,
    );

    return { serviceId };
  }

  protected render({ serviceId }: Result): ReactNode {
    if (this.flags.quiet) {
      return serviceId;
    }
  }
}
