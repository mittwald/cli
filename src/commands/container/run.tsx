import { ReactNode } from "react";
import { Args, Flags } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import * as dockerNames from "docker-names";
import { assertStatus, MittwaldAPIV2 } from "@mittwald/api-client";
import * as fs from "fs/promises";
import { parse } from "envfile";
import { pathExists } from "../../lib/util/fs/pathExists.js";

type ContainerContainerImageConfigExposedPort =
  MittwaldAPIV2.Components.Schemas.ContainerContainerImageConfigExposedPort;
type ContainerStackResponse =
  MittwaldAPIV2.Components.Schemas.ContainerStackResponse;
type ContainerServiceResponse =
  MittwaldAPIV2.Components.Schemas.ContainerServiceResponse;
type ContainerServiceDeclareRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceDeclareRequest;
type ContainerContainerImageConfig =
  MittwaldAPIV2.Components.Schemas.ContainerContainerImageConfig;

type Result = {
  serviceId: string;
};

export class Run extends ExecRenderBaseCommand<typeof Run, Result> {
  static summary = "Creates and starts a new container.";
  static flags = {
    ...processFlags,
    ...projectFlags,
    env: Flags.string({
      summary: "set environment variables in the container",
      description:
        "Format: KEY=VALUE. Multiple environment variables can be specified with multiple --env flags.",
      required: false,
      multiple: true,
      char: "e",
    }),
    "env-file": Flags.string({
      summary: "read environment variables from a file",
      description:
        "The file should contain lines in the format KEY=VALUE. Multiple files can be specified with multiple --env-file flags.",
      multiple: true,
      required: false,
    }),
    description: Flags.string({
      summary: "add a descriptive label to the container",
      description: "This helps identify the container's purpose or contents.",
      required: false,
    }),
    entrypoint: Flags.string({
      summary: "override the default entrypoint of the container image",
      description:
        "The entrypoint is the command that will be executed when the container starts. If omitted, the entrypoint defined in the image will be used.",
      required: false,
    }),
    name: Flags.string({
      summary: "assign a custom name to the container",
      description:
        "This makes it easier to reference the container in subsequent commands. If omitted, a random name will be generated automatically.",
      required: false,
    }),
    publish: Flags.string({
      summary: "publish a container's port(s) to the host",
      description:
        "Map a container's port to a port on the host system. " +
        "Format: <host-port>:<container-port> or just <container-port> (in which case the host port will be automatically assigned). " +
        "For example, -p 8080:80 maps port 80 in the container to port 8080 on the host. " +
        "Use multiple -p flags to publish multiple ports.",
      required: false,
      multiple: true,
      char: "p",
    }),
    "publish-all": Flags.boolean({
      summary: "publish all ports that are defined in the image",
      description:
        "Automatically publish all ports that are exposed by the container image to random ports on the host.",
      required: false,
      char: "P",
    }),
    volume: Flags.string({
      summary: "bind mount a volume to the container",
      description:
        "This flag can be used to add volume mounts to the container. It can be used multiple times to mount multiple volumes." +
        "" +
        "Needs to be in the format <host-path>:<container-path>. " +
        "" +
        "If you specify a file path as volume, this will mount a path from your hosting environment's file system (NOT your local file system) into the container. " +
        "You can also specify a named volume, which needs to be created beforehand.",
      required: false,
      char: "v",
      multiple: true,
    }),
  };
  static args = {
    image: Args.string({
      summary: "container image to run",
      description:
        "Can be specified as a repository/tag or repository@digest (e.g., 'ubuntu:20.04' or 'alpine@sha256:abc123...'). If no tag is provided, 'latest' is assumed.",
      required: true,
    }),
    command: Args.string({
      summary: "command to run in the container",
      description:
        "This overrides the default command specified in the container image. If omitted, the default command from the image will be used. For example, 'bash' or 'python app.py'.",
      required: false,
    }),
    args: Args.string({
      summary: "arguments to pass to the command",
      description:
        "These are the runtime arguments passed to the command specified by the command parameter or the container's default command, not to the container itself. For example, if the command is 'echo', the args might be 'hello world'.",
      required: false,
      variadic: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a container");

    const projectId = await this.withProjectId(Run);
    const stackId = projectId;
    const serviceName = this.getServiceName();

    const { image, meta: imageMeta } = await p.runStep(
      "getting image metadata",
      this.getImageAndMeta(projectId),
    );

    const serviceRequest = await p.runStep(
      "preparing service request",
      this.buildServiceRequest(image, imageMeta, serviceName),
    );

    const stack = await p.runStep(
      "creating container",
      this.addServiceToStack(stackId, serviceName, serviceRequest),
    );

    const service = stack.services?.find(matchServiceByName(serviceName));
    const serviceId = service?.id;

    if (!serviceId) {
      throw new Error("Service ID not found in the created stack.");
    }

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully created and
        started.
      </Success>,
    );

    return { serviceId };
  }

  private async addServiceToStack(
    stackId: string,
    serviceName: string,
    serviceRequest: ContainerServiceDeclareRequest,
  ): Promise<ContainerStackResponse> {
    const resp = await this.apiClient.container.updateStack({
      stackId,
      data: {
        services: {
          [serviceName]: serviceRequest,
        },
      },
    });

    assertStatus(resp, 200);
    return resp.data;
  }

  /**
   * Builds a container service request from command line arguments and image
   * metadata
   *
   * @param image The container image to use
   * @param imageMeta Metadata about the container image
   * @param serviceName Name of the service to create
   * @returns A properly formatted container service request
   */
  private async buildServiceRequest(
    image: string,
    imageMeta: ContainerContainerImageConfig,
    serviceName: string,
  ): Promise<ContainerServiceDeclareRequest> {
    const command = this.args.command ? [this.args.command] : imageMeta.command;
    const entrypoint = this.flags.entrypoint
      ? [this.flags.entrypoint]
      : imageMeta.entrypoint;
    const description = this.flags.description ?? serviceName;
    const envs = await this.parseEnvironmentVariables();
    const ports = this.getPortMappings(imageMeta);
    const volumes = this.flags.volume;

    return {
      image,
      command,
      entrypoint,
      description,
      envs,
      ports,
      volumes,
    };
  }

  /**
   * Parses environment variables from command line flags and env files
   *
   * @returns An object containing environment variable key-value pairs
   */
  private async parseEnvironmentVariables(): Promise<Record<string, string>> {
    return {
      ...this.parseEnvironmentVariablesFromEnvFlags(),
      ...(await this.parseEnvironmentVariablesFromFile()),
    };
  }

  private async parseEnvironmentVariablesFromFile() {
    const result: Record<string, string> = {};
    for (const envFile of this.flags["env-file"] ?? []) {
      if (!(await pathExists(envFile))) {
        throw new Error(`Env file not found: ${envFile}`);
      }

      const fileContent = await fs.readFile(envFile, { encoding: "utf-8" });
      const parsed = parse(fileContent);

      Object.assign(result, parsed);
    }
    return result;
  }

  private parseEnvironmentVariablesFromEnvFlags() {
    const splitIntoKeyAndValue = (e: string) => e.split("=", 2);
    const envFlags = this.flags.env ?? [];

    return Object.fromEntries(envFlags.map(splitIntoKeyAndValue));
  }

  /**
   * Determines which ports to expose based on flags and image metadata
   *
   * @param imageMeta Metadata about the container image
   * @returns An array of port mappings
   */
  private getPortMappings(imageMeta: ContainerContainerImageConfig): string[] {
    if (this.flags["publish-all"]) {
      const concatPort = (p: ContainerContainerImageConfigExposedPort) =>
        `${p.port}:${p.port}`;
      const definedPorts = imageMeta.exposedPorts ?? [];

      return definedPorts.map(concatPort);
    }

    return this.flags.publish ?? [];
  }

  private async getImageAndMeta(projectId: string) {
    const { image } = this.args;
    const meta = await this.getImageMeta(image, projectId);

    return { image, meta };
  }

  private async getImageMeta(
    image: string,
    projectId: string,
  ): Promise<ContainerContainerImageConfig> {
    const resp = await this.apiClient.container.getContainerImageConfig({
      queryParameters: {
        imageReference: image,
        useCredentialsForProjectId: projectId,
      },
    });

    assertStatus(resp, 200);
    return resp.data;
  }

  private getServiceName(): string {
    const { name } = this.flags;
    if (name !== undefined) {
      return name;
    }

    return dockerNames.getRandomName();
  }

  protected render({ serviceId }: Result): ReactNode {
    if (this.flags.quiet) {
      return serviceId;
    }
  }
}

function matchServiceByName(name: string) {
  return (service: ContainerServiceResponse) => service.serviceName === name;
}
