import { ReactNode } from "react";
import { Args, Flags } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { assertStatus, MittwaldAPIV2 } from "@mittwald/api-client";
import {
  parseEnvironmentVariables,
  getPortMappings,
  getImageMeta,
} from "../../lib/resources/container/containerconfig.js";
import {
  containerDescriptionFlag,
  containerEntrypointFlag,
  containerEnvFileFlag,
  containerEnvFlag,
  containerPublishFlag,
  containerPublishAllFlag,
  containerVolumeFlag,
  containerVolumeFormatDescription,
} from "../../lib/resources/container/common-flags.js";

type ContainerServiceRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceRequest;

type Result = {
  serviceId: string;
};

export class Update extends ExecRenderBaseCommand<typeof Update, Result> {
  static summary = "Updates an existing container.";
  static description =
    "Updates attributes of an existing container such as image, environment variables, etc.";
  static flags = {
    ...processFlags,
    ...projectFlags,
    image: Flags.string({
      summary: "update the container image",
      description: "Specify a new image to use for the container.",
      required: false,
    }),
    env: containerEnvFlag(),
    "env-file": containerEnvFileFlag(),
    description: containerDescriptionFlag({
      summary: "update the descriptive label of the container",
    }),
    entrypoint: containerEntrypointFlag(),
    command: Flags.string({
      summary: "update the command to run in the container",
      description:
        "This overrides the default command specified in the container image.",
      required: false,
    }),
    publish: containerPublishFlag({
      char: "p",
    }),
    "publish-all": containerPublishAllFlag,
    volume: containerVolumeFlag({
      summary: "update volume mounts for the container",
      description:
        "This flag can be used to replace volume mounts of the container. It can be used multiple times to mount multiple volumes." +
        containerVolumeFormatDescription,
    }),
    recreate: Flags.boolean({
      summary: "recreate the container after updating",
      description:
        "If set, the container will be automatically recreated after updating its configuration.",
      required: false,
      default: false,
    }),
  };
  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to update",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Updating container");
    const [serviceId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Update,
      this.flags,
      this.args,
      this.config,
    );

    const service = await p.runStep(
      "getting container configuration",
      async () => {
        const r = await this.apiClient.container.getService({
          serviceId,
          stackId,
        });

        assertStatus(r, 200);
        return r.data;
      },
    );

    const updatePayload = await p.runStep(
      "preparing update request",
      this.buildUpdateRequest(),
    );

    if (Object.keys(updatePayload).length === 0) {
      await p.complete(<Success>Nothing to change. Have a good day!</Success>);
      return { serviceId };
    }

    await p.runStep("updating container configuration", async () => {
      const r = await this.apiClient.container.updateStack({
        stackId,
        data: {
          services: {
            [service.serviceName]: updatePayload,
          },
        },
      });

      assertStatus(r, 200);
    });

    // Recreate the container if requested
    if (this.flags.recreate) {
      await p.runStep("recreating container", async () => {
        const r = await this.apiClient.container.recreateService({
          serviceId,
          stackId,
        });

        assertSuccess(r);
      });
    }

    await p.complete(
      <Success>
        Container <Value>{serviceId}</Value> was successfully updated.
        {this.flags.recreate &&
          " The container was recreated with the new configuration."}
      </Success>,
    );

    return { serviceId };
  }

  /**
   * Builds a container service update request from command line flags
   *
   * @returns A properly formatted container service request with only the
   *   fields to update
   */
  private async buildUpdateRequest(): Promise<ContainerServiceRequest> {
    const updateRequest: ContainerServiceRequest = {};

    if (this.flags.image) {
      updateRequest.image = this.flags.image;

      // Get image metadata for port mappings if publish-all is specified
      if (this.flags["publish-all"]) {
        const projectId = await this.withProjectId(Update);
        const imageMeta = await getImageMeta(
          this.apiClient,
          this.flags.image,
          projectId,
        );
        updateRequest.ports = getPortMappings(imageMeta, true);
      }
    }

    if (this.flags.command) {
      updateRequest.command = [this.flags.command];
    }

    if (this.flags.entrypoint) {
      updateRequest.entrypoint = [this.flags.entrypoint];
    }

    if (this.flags.description) {
      updateRequest.description = this.flags.description;
    }

    if (this.flags.env || this.flags["env-file"]) {
      updateRequest.envs = await parseEnvironmentVariables(
        this.flags.env,
        this.flags["env-file"],
      );
    }

    if (this.flags.publish) {
      updateRequest.ports = this.flags.publish;
    }

    if (this.flags.volume) {
      updateRequest.volumes = this.flags.volume;
    }

    return updateRequest;
  }

  protected render({ serviceId }: Result): ReactNode {
    if (this.flags.quiet) {
      return serviceId;
    }
  }
}
