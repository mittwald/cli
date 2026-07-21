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
  DEFAULT_IMAGE_NAME,
  DEFAULT_IMAGE_TAG,
} from "@mittwald/container-deploy";

type Result = {
  deployedServiceId?: string;
  builtImageName?: string;
  buildOnly: boolean;
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
        "Format: KEY=VALUE or KEY. If only KEY is provided, the value is resolved from the caller environment (exported variables only). Multiple environment variables can be specified with multiple --env flags.",
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
    "uri-prefix": Flags.string({
      summary: "prefix for the generated default domain",
      description: "Defaults to 'webapp'.",
      required: false,
      default: "webapp",
    }),
    "service-name": Flags.string({
      summary: "name of the container service to deploy",
      description:
        "Set this to run multiple parallel deployments in the same project. Defaults to 'app-<project-id>'.",
      required: false,
    }),
    "image-name": Flags.string({
      summary: "name of the Docker image to build and push",
      description: `Defaults to '${DEFAULT_IMAGE_NAME}'.`,
      required: false,
    }),
    "image-tag": Flags.string({
      summary: "tag of the Docker image to build and push",
      description: `Defaults to '${DEFAULT_IMAGE_TAG}'.`,
      required: false,
    }),
    "build-only": Flags.boolean({
      summary: "build and push the image only",
      description:
        "Skips service deployment and domain creation after the image is pushed.",
      default: false,
      required: false,
    }),
  };
  static args = {};
  static examples = [
    {
      description:
        "Deploy from current directory (auto-detects or creates Dockerfile)",
      command: "$ <%= config.bin %> <%= command.id %>",
    },
    {
      description: "Deploy with explicit project context",
      command: "<%= config.bin %> <%= command.id %> --project-id p-abc123",
    },
    {
      description: "Deploy with custom default domain prefix",
      command: "<%= config.bin %> <%= command.id %> --uri-prefix myapp",
    },
    {
      description:
        "Deploy a second, parallel service with a custom image and service name",
      command:
        "<%= config.bin %> <%= command.id %> --service-name my-feature --image-name my-app --image-tag feature",
    },
    {
      description: "Build and push image only, without deploying a service",
      command: "<%= config.bin %> <%= command.id %> --build-only",
    },
  ];

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Deploying ...");

    let deployedServiceId: string | undefined;

    const projectId = await this.withProjectId(Deploy);
    const projectShortId = await getProjectShortIdFromUuid(
      this.apiClient,
      projectId,
    );

    await p.runStep("Checking dev tools ...", async () => {
      checkRequiredTools();
    });

    const environment = await parseEnvironmentVariables(
      this.flags.env,
      this.flags["env-file"],
    );

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
        return await checkRepository(environment);
      },
    );

    const builtImage = await p.runStep(
      "Building Docker image ...",
      async () => {
        const result = await buildDockerImage(registryData, repositoryData, {
          name: this.flags["image-name"],
          tag: this.flags["image-tag"],
        });
        p.addInfo(`Built image ${result.imageName}`);
        return result;
      },
    );

    await p.runStep("Pushing docker image ...", async () => {
      await localDockerPush(builtImage, registryData);
      p.addInfo(`Pushed image ${builtImage.imageName} to registry`);
    });

    if (this.flags["build-only"]) {
      await p.complete(
        <Success>
          Image <Value>{builtImage.imageName}</Value> was successfully built and
          pushed
        </Success>,
      );

      return {
        deployedServiceId,
        builtImageName: builtImage.imageName,
        buildOnly: true,
      };
    }

    const deployResult = await p.runStep("Deploying ...", async () => {
      const result = await deployService(
        this.apiClient,
        projectId,
        repositoryData,
        this.flags["wait-timeout"],
        environment,
        this.flags["service-name"],
      );
      deployedServiceId = result.deployedServiceId;
      p.addInfo(`Service ${result.serviceName} is now running`);
      return result;
    });

    await p.runStep("Setting up domain ...", async () => {
      const uriPrefix = this.flags["uri-prefix"];
      const uri = `${uriPrefix}.${projectShortId}.project.space`;
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

    return {
      deployedServiceId,
      builtImageName: builtImage.imageName,
      buildOnly: false,
    };
  }

  protected render({
    deployedServiceId,
    builtImageName,
    buildOnly,
  }: Result): ReactNode {
    if (this.flags.quiet) {
      return buildOnly ? builtImageName : deployedServiceId;
    }
  }
}
