import { ReactNode } from "react";
import { spawnSync } from "child_process";
import { ExecRenderBaseCommand } from "../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../rendering/process/process_flags.js";
import { projectFlags } from "../lib/resources/project/flags.js";
import assertSuccess from "../lib/apiutil/assert_success.js";
import { Success } from "../rendering/react/components/Success.js";
import { Value } from "../rendering/react/components/Value.js";
import { assertStatus, MittwaldAPIV2 } from "@mittwald/api-client";
import { generatePasswordWithSpecialChars } from "../lib/util/password/generatePasswordWithSpecialChars.js";
import { waitFlags, waitUntil } from "../lib/wait.js";
import fs from "fs/promises";
import path from "path";
import { pathExists } from "../lib/util/fs/pathExists.js";


type RepositoryData = {
  dockerfilePath: string;
  dockerfileContent: string;
  dockerfileCreated: boolean;
  buildContext: string;
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
  static args = {
  };

  private defaultDockerfile = `FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
`;

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Deploying ...");

    let repositoryData: RepositoryData;
    let registryUri = "";
    let registryUsername = "";
    let registryPassword = "";

    await p.runStep("Setting up registry ...", async () => {
      const projectId = await this.withProjectId(Deploy);
      // 1. List registries and filter out default ones
      const registriesResp = await this.apiClient.container.listRegistries({ projectId });
      assertStatus(registriesResp, 200);

      const isDefaultRegistry = (r: MittwaldAPIV2.Components.Schemas.ContainerRegistry) => {
        const uri = r.uri || "";
        return uri.includes("docker.io") || uri.includes("ghcr.io") || uri.includes("gitlab.com");
      };
      let registry = registriesResp.data.find(r => !isDefaultRegistry(r));
      let created = false;
      let username: string = "";
      let password: string = "";
      let uri: string = "";

      if (!registry) {
        // 2. Generate random credentials
        username = `user_${Math.random().toString(36).slice(2, 10)}`;
        password = generatePasswordWithSpecialChars();

        // 3. Build registry URL: registry.p-XXXXXX.project.space
        const subdomain = `registry.${projectId}`;
        uri = `${subdomain}.project.space`;

        // 4. Create the registry container (service)
        const image = "mittwald/registry:3";
        const serviceName = "project-registry";
        const environment = {
          REGISTRY_AUTH_USERNAME: username,
          REGISTRY_AUTH_PASSWORD: password,
        };
        // Expose port 5000 (default for registry)
        const ports = ["5000:5000/tcp"];
        // Compose service request
        const serviceRequest = {
          image,
          description: "Project private registry",
          environment,
          ports,
        };
        // Add service to stack (projectId is used as stackId)
        const stackId = projectId;
        const updateResp = await this.apiClient.container.updateStack({
          stackId,
          data: { services: { [serviceName]: serviceRequest } },
        });

        assertStatus(updateResp, 200);

        // 5. Wait for container to be running
        await waitUntil(async () => {
          const servicesResp = await this.apiClient.container.listServices(
            { projectId }
          );
          assertStatus(servicesResp, 200);
          const services = servicesResp.data;

          const regSvc = services.find(svc => svc.serviceName === serviceName);
          if (regSvc && regSvc.status === "running") {
            return true;
          }
        }, this.flags["wait-timeout"]);

        // 6. Register the registry entry
        const registryCreationPayload = {
          uri: `https://${uri}`,
          description: `Default registry for project ${projectId}`,
          credentials: { username, password },
        };
        const createResp = await this.apiClient.container.createRegistry({
          projectId,
          data: registryCreationPayload,
        });
        assertStatus(createResp, 201);
        registry = createResp.data;
        created = true;
      } else {
        // Fetch the registry service and extract credentials from environment variables
        const servicesResp = await this.apiClient.container.listServices({
          projectId,
        });
        assertStatus(servicesResp, 200);
        
        const registryService = servicesResp.data.find(
          svc => svc.serviceName === "project-registry"
        );
        
        if (registryService) {
          const serviceDetailsResp =
            await this.apiClient.container.getService({
              serviceId: registryService.id,
              stackId: projectId,
            });
          assertStatus(serviceDetailsResp, 200);
          
          const service = serviceDetailsResp.data;
          username =
            service.deployedState?.envs?.REGISTRY_AUTH_USERNAME ?? "";
          password =
            service.deployedState?.envs?.REGISTRY_AUTH_PASSWORD ?? "";
        }
        
        uri = registry.uri;
      }

      // 7. Output result to user
      p.addInfo(
            created ? "Created new registry." : "Using existing registry."
      );

      registryUri = uri;
      registryUsername = username;
      registryPassword = password;

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

      repositoryData = {
        dockerfilePath,
        dockerfileContent,
        dockerfileCreated,
        buildContext: projectRoot,
      };
    });

    await p.runStep("Building Docker image ...", async () => {
      const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const registryHost = registryUri.replace(/^https?:\/\//, '');
      const imageName = `${registryHost}/app-image:${timestamp}`;

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
      const loginResult = spawnSync('docker', [
        'login',
        registryUri,
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
        ports: ["8080:8080/tcp"],
      };

      const updateResp = await this.apiClient.container.updateStack({
        stackId,
        data: { services: { [serviceName]: serviceRequest } },
      });

      assertStatus(updateResp, 200);
      p.addInfo(`Created/updated service ${serviceName}`);

      // 2. Wait for the service to be running
      await waitUntil(async () => {
        const servicesResp = await this.apiClient.container.listServices({
          projectId,
        });
        assertStatus(servicesResp, 200);
        const services = servicesResp.data;

        const deployedSvc = services.find(svc => svc.serviceName === serviceName);
        if (deployedSvc) {
          deployedServiceId = deployedSvc.id;
          if (deployedSvc.status === "running") {
            return true;
          }
        }
      }, this.flags["wait-timeout"]);

      p.addInfo(`Service ${serviceName} is now running`);
    });

    const serviceId = deployedServiceId;

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
