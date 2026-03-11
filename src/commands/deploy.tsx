import { ReactNode } from "react";
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
      let username, password, uri;

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
            service.deployedState?.envs?.REGISTRY_AUTH_USERNAME;
          password =
            service.deployedState?.envs?.REGISTRY_AUTH_PASSWORD;
        }
        
        uri = registry.uri;
      }

      // 7. Output result to user
      p.addInfo(
            created ? "Created new registry." : "Using existing registry."
      );

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
      // Call docker image builder ( or docker build directly )
    });

    await p.runStep("Pushing docker image ...", async () => {
      // Call docker image builder ( or docker build directly )
    });

    await p.runStep("deploying ...", async () => {
      // main sequence of commands go here! OR even make several steps in order to improve UI/UX, e.g. long running steps

      const r = await this.apiClient.container.stopService({
        serviceId,
        stackId,
      });

      assertSuccess(r);
    });

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully stopped.
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
