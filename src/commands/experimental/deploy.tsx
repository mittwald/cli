import { ReactNode } from "react";
import { Flags } from "@oclif/core";

import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { parseEnvironmentVariables } from "../../lib/resources/container/containerconfig.js";
import {
  containerEnvFileFlag,
  containerEnvFlag,
} from "../../lib/resources/container/common-flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { waitFlags } from "../../lib/wait.js";
import { getProjectShortIdFromUuid } from "../../lib/resources/project/shortId.js";
import { ensureStackForService } from "../../lib/resources/stack/ensure.js";
import { serviceNameFromDirectory } from "../../lib/resources/container/service-name.js";

import {
  checkRequiredTools,
  setupProjectRegistry,
  MW_REGISTRY_SERVICE_NAME as registryServiceName,
  checkRepository,
  buildDockerImage,
  localDockerPush,
  deployService,
  createAndWaitForDomain,
  DEFAULT_IMAGE_TAG,
} from "@mittwald/container-deploy";

type Result = {
  deployedServiceId?: string;
  builtImageName?: string;
  buildOnly: boolean;
};

const registryStackDescription = "project registry";

export class Deploy extends ExecRenderBaseCommand<typeof Deploy, Result> {
  static summary =
    "Build the application in the current directory and deploy it as a container.";
  static description = `\
The command runs the following steps:

1. Checks that Docker and Railpack are installed locally.
2. Makes sure that the project has a working private container registry. The registry runs as the "${registryServiceName}" container in a dedicated stack, is reachable at the "registry" subdomain of the project's default domain and is configured as a registry of the project. Missing or misconfigured parts are created or repaired; existing parts (including the stored images and the credentials) are reused. There is one such registry per project, shared by all deployments.
3. Builds a container image from the current directory, using the Dockerfile in it if there is one, and Railpack otherwise. The container ports are taken from the EXPOSE instructions of the Dockerfile; a PORT variable passed with --env takes precedence. Without either, port 80 is used.
4. Pushes the image to the project registry.
5. Deploys the image as a container service. Each service runs in a stack of its own, named after the service; a service that already exists is updated in the stack it is in.
6. Makes the service available at <uri-prefix>.<project-short-id>.project.space.

With --build-only, the command stops after pushing the image.

The service name defaults to the name of the current directory (lowercased, with every run of characters other than letters and digits replaced by a dash), and the image name and domain prefix default to the service name. Deploying from different directories therefore creates independent deployments, while deploying again from the same directory updates the existing one.`;
  static flags = {
    ...processFlags,
    ...projectFlags,
    ...waitFlags,
    env: containerEnvFlag(),
    "env-file": containerEnvFileFlag(),
    "uri-prefix": Flags.string({
      summary: "prefix for the generated default domain",
      description: "Defaults to the service name.",
      required: false,
    }),
    "service-name": Flags.string({
      summary: "name of the container service to deploy",
      description:
        "Also names the stack the service is deployed into. Defaults to the name of the current directory.",
      required: false,
    }),
    "image-name": Flags.string({
      summary: "name of the Docker image to build and push",
      description: "Defaults to the service name.",
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
        "Deploy the current directory as a second, independent service, e.g. for a feature branch",
      command:
        "<%= config.bin %> <%= command.id %> --service-name my-app-feature --image-tag feature",
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
    const serviceName = this.getServiceName();

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
        const { stackId: registryStackId, created } =
          await ensureStackForService(
            this.apiClient,
            projectId,
            registryServiceName,
            registryStackDescription,
          );
        if (created) {
          p.addInfo(`Created stack "${registryStackDescription}"`);
        }

        const registry = await setupProjectRegistry(
          this.apiClient,
          projectId,
          registryStackId,
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
          name: this.flags["image-name"] ?? serviceName,
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
      const { stackId: applicationStackId, created } =
        await ensureStackForService(
          this.apiClient,
          projectId,
          serviceName,
          serviceName,
        );
      if (created) {
        p.addInfo(`Created stack "${serviceName}"`);
      }

      const result = await deployService(
        this.apiClient,
        projectId,
        applicationStackId,
        repositoryData,
        this.flags["wait-timeout"],
        environment,
        serviceName,
      );
      deployedServiceId = result.deployedServiceId;
      p.addInfo(`Service ${result.serviceName} is now running`);
      return result;
    });

    await p.runStep("Setting up domain ...", async () => {
      const uriPrefix = this.flags["uri-prefix"] ?? serviceName;
      const uri = `${uriPrefix}.${projectShortId}.project.space`;
      const appServiceId = deployResult.deployedServiceId;
      const timeout = this.flags["wait-timeout"];
      await createAndWaitForDomain(
        this.apiClient,
        projectId,
        uri,
        appServiceId,
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

  private getServiceName(): string {
    const serviceName =
      this.flags["service-name"] ?? serviceNameFromDirectory(process.cwd());

    if (!serviceName) {
      throw new Error(
        "Could not derive a service name from the current directory name; please set one with --service-name.",
      );
    }

    if (serviceName === registryServiceName) {
      throw new Error(
        `The service name "${registryServiceName}" is reserved for the project registry; please choose a different one with --service-name.`,
      );
    }

    return serviceName;
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
