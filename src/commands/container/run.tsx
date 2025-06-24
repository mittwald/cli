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
import { ProcessRenderer } from "../../rendering/process/process.js";
import ContainerServiceResponse = MittwaldAPIV2.Components.Schemas.ContainerServiceResponse;

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
      description: "environment variables to set in the container",
      required: false,
      multiple: true,
      char: "e",
    }),
    "env-file": Flags.string({
      description: "read environment variables from this file",
      multiple: true,
      required: false,
    }),
    description: Flags.string({
      description: "optional description for the container",
      required: false,
    }),
    entrypoint: Flags.string({
      description:
        "entrypoint of the container; if omitted, the entrypoint from the image will be used",
      required: false,
    }),
    name: Flags.string({
      description:
        "name of the container; if omitted, a random name will be generated",
      required: false,
    }),
    publish: Flags.string({
      summary: "publish a port from the container to the host",
      description:
        "This flag can be used to publish a port from the container to the host. " +
        "It can be used multiple times to publish multiple ports. " +
        "Needs to be in the format <host-port>:<container-port> or <container-port>.",
      required: false,
      multiple: true,
      char: "p",
    }),
    "publish-all": Flags.boolean({
      description: "publish all ports that are defined in the image",
      required: false,
      char: "P",
    }),
    volume: Flags.string({
      summary: "volume mount within the container",
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
      description: "container image to run",
      required: true,
    }),
    command: Args.string({
      description:
        "command to run in the container; omit to use default command from image",
      required: false,
    }),
    args: Args.string({
      description: "arguments to pass to the command",
      required: false,
      variadic: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a container");

    const projectId = await this.withProjectId(Run);
    const stackId = projectId;

    const serviceName = this.getServiceName();
    const { image, meta: imageMeta } = await this.getImageAndMeta(p, projectId);
    const serviceRequest = this.buildServiceRequest(
      image,
      imageMeta,
      serviceName,
    );

    const stack = await p.runStep("creating container", async () => {
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
    });

    const service = stack.services?.find(matchServiceByName(serviceName));
    const serviceId = service?.id;

    if (!serviceId) {
      throw new Error("Service ID not found in the created stack.");
    }

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully stopped.
      </Success>,
    );

    return { serviceId };
  }

  private buildServiceRequest(
    image: string,
    imageMeta: ContainerContainerImageConfig,
    serviceName: string,
  ): ContainerServiceDeclareRequest {
    const command = this.args.command ? [this.args.command] : imageMeta.command;
    const entrypoint = this.flags.entrypoint
      ? [this.flags.entrypoint]
      : imageMeta.entrypoint;
    const description = this.flags.description ?? serviceName;
    const envs = Object.fromEntries(
      this.flags.env?.map((e) => e.split("=", 2)) ?? [],
    );
    const ports = this.flags["publish-all"]
      ? (imageMeta.exposedPorts?.map((p) => p.port + ":" + p.port) ?? [])
      : (this.flags.publish ?? []);
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

  private async getImageAndMeta(p: ProcessRenderer, projectId: string) {
    const { image } = this.args;
    const meta = await this.getImageMeta(p, image, projectId);

    return { image, meta };
  }

  private async getImageMeta(
    p: ProcessRenderer,
    image: string,
    projectId: string,
  ): Promise<ContainerContainerImageConfig> {
    return p.runStep("getting image metadata", async () => {
      const resp = await this.apiClient.container.getContainerImageConfig({
        queryParameters: {
          imageReference: image,
          useCredentialsForProjectId: projectId,
        },
      });

      assertStatus(resp, 200);
      return resp.data;
    });
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
