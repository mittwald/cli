import { ReactNode } from "react";

import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { waitFlags } from "../../lib/wait.js";
import { getProjectShortIdFromUuid } from "../../lib/resources/project/shortId.js";

import {
  setupProjectRegistry,
  localDockerBuild,
  localDockerPush,
  checkDocker,
  checkRailpack,
 } from "../../lib/resources/registry/manage.js";

import {
  checkRepository
} from "../../lib/resources/repository/manage.js";

import {
  deployService
} from "../../lib/resources/service/manage.js";

import {
  RepositoryData
} from "../../lib/resources/repository/types.js";

import {
  RegistryData,
} from "../../lib/resources/registry/types.js";

import {
  DeployRes
} from "src/lib/resources/service/types.js";

type Result = {
  deployedServiceId: string;
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
    let deployRes: DeployRes;
    let deployedServiceId: string = "";

    const projectId = await this.withProjectId(Deploy);
    const projectShortId = await getProjectShortIdFromUuid(
      this.apiClient,
      projectId
    );

    await p.runStep("Checking dev tools ...", async () => {
      checkDocker();
      checkRailpack();
    });

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
      // XXX: This step can become much more clever now, using tools like
      // railpack, buildpacks, etc. to auto-detect how to best build the project.
      repositoryData = await checkRepository();
    });

    await p.runStep("Building Docker image ...", async () => {
      // XXX: Based on result from repo check, local docker build might not even be the best,
      // maybe railpack can do better, especially for common stuff
      repositoryData = await localDockerBuild(registryData, repositoryData);
      p.addInfo(`Built image ${repositoryData.imageName}`);
    });

    await p.runStep("Pushing docker image ...", async () => {
      await localDockerPush(repositoryData, registryData);
      p.addInfo(`Pushed image ${repositoryData.imageName} to registry`);
    });

    await p.runStep("deploying ...", async () => {
      deployRes = await deployService(
        this.apiClient,
        projectId,
        repositoryData,
        this.flags["wait-timeout"]
      )
      deployedServiceId = deployRes.deployedServiceId;
      p.addInfo(`Service ${deployRes.serviceName} is now running`);
    });

    // XXX: missing step: create ingress to expose the deployed service via domain?
    // For now, users can do it manually if needed, or we can add it in a future iteration.
    // XXX: Implement this for full convenience!

    await p.complete(
      <Success>
        Container <Value>{deployedServiceId}</Value> was successfully deployed.
      </Success>,
    );

    return { deployedServiceId };
  }

  protected render({ deployedServiceId }: Result): ReactNode {
    if (this.flags.quiet) {
      return deployedServiceId;
    }
  }
}
