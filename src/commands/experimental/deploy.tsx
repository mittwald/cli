import { ReactNode } from "react";
import { Flags } from "@oclif/core";

import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { parseEnvironmentVariables } from "../../lib/resources/container/containerconfig.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { waitFlags } from "../../lib/wait.js";
import { getProjectShortIdFromUuid } from "../../lib/resources/project/shortId.js";

import {
  checkRequiredTools,
  setupProjectRegistry,
  checkRepository,
  buildDockerImage,
  localDockerPush,
  deployService,
  createAndWaitForDomain,
} from "@mittwald/container-deploy";

type Result = {
  deployedServiceId: string;
};

export class Deploy extends ExecRenderBaseCommand<typeof Deploy, Result> {
  static summary = "Deploys a new container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
    ...waitFlags,
    env: Flags.string({
      summary: "set environment variables in the container",
      description:
        "Format: KEY=VALUE. Multiple environment variables can be specified with multiple --env flags.",
      required: false,
      multiple: true,
      multipleNonGreedy: true,
      char: "e",
    }),
    "env-file": Flags.string({
      summary: "read environment variables from a file",
      description:
        "The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file flags.",
      multiple: true,
      multipleNonGreedy: true,
      required: false,
    }),
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

    let deployedServiceId: string = "";

    const projectId = await this.withProjectId(Deploy);
    const projectShortId = await getProjectShortIdFromUuid(
      this.apiClient,
      projectId,
    );

    await p.runStep("Checking dev tools ...", async () => {
      checkRequiredTools();
    });

    const registryData = await p.runStep(
      "Setting up registry ...",
      async () => {
        const registry = await setupProjectRegistry(
          this.apiClient,
          projectId,
          projectShortId,
          this.flags["wait-timeout"],
        );

        p.addInfo(
          registry.created
            ? "Created new registry."
            : "Using existing registry.",
        );

        return registry;
      },
    );

    const repositoryData = await p.runStep(
      "Checking repository ...",
      async () => {
        return await checkRepository();
      },
    );

    const builtImage = await p.runStep(
      "Building Docker image ...",
      async () => {
        const result = await buildDockerImage(registryData, repositoryData);
        p.addInfo(`Built image ${result.imageName}`);
        return result;
      },
    );

    await p.runStep("Pushing docker image ...", async () => {
      await localDockerPush(builtImage, registryData);
      p.addInfo(`Pushed image ${builtImage.imageName} to registry`);
    });

    const environment = await parseEnvironmentVariables(
      this.flags.env,
      this.flags["env-file"],
    );

    const deployResult = await p.runStep("Deploying ...", async () => {
      const result = await deployService(
        this.apiClient,
        projectId,
        repositoryData,
        this.flags["wait-timeout"],
        environment,
      );
      deployedServiceId = result.deployedServiceId;
      p.addInfo(`Service ${result.serviceName} is now running`);
      return result;
    });

    await p.runStep("Setting up domain ...", async () => {
      const uri = `webapp.${projectShortId}.project.space`;
      const registryServiceId = deployResult.deployedServiceId;
      const timeout = this.flags["wait-timeout"];
      await createAndWaitForDomain(
        this.apiClient,
        projectId,
        uri,
        registryServiceId,
        repositoryData.ports[0],
        timeout,
      );
    });

    await p.complete(
      <Success>
        Container <Value>{deployedServiceId}</Value> was successfully deployed
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
