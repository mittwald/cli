import { ReactNode } from "react";
import { spawnSync } from "child_process";


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

import {
  setupProjectRegistry,
  localDockerBuild,
  localDockerPush,
 } from "../../lib/resources/registry/manage.js";

 import {
  checkRepository
} from "../../lib/resources/repository/manage.js";

import {
  RepositoryData
} from "../../lib/resources/repository/types.js";

import {
  RegistryData,
} from "../../lib/resources/registry/types.js";

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

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Deploying ...");

    let repositoryData: RepositoryData;
    let registryData: RegistryData;

    const projectId = await this.withProjectId(Deploy);
    const projectShortId = await getProjectShortIdFromUuid(
      this.apiClient,
      projectId
    );

    await p.runStep("Setting up registry ...", async () => {

      registryData = await setupProjectRegistry(
        this.apiClient,
        projectId,
        projectShortId,
        this.flags["wait-timeout"]
      );

      p.addInfo(
          registryData.created ? "Created new registry." : "Using existing registry."
      );

    });

    await p.runStep("Checking repository ...", async () => {
      repositoryData = await checkRepository();
    });

    await p.runStep("Building Docker image ...", async () => {
      repositoryData = await localDockerBuild(registryData, repositoryData);
      p.addInfo(`Built image ${repositoryData.imageName}`);
    });

    await p.runStep("Pushing docker image ...", async () => {
      await localDockerPush(repositoryData, registryData);
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
