import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { stackArgs } from "../../lib/resources/stack/flags.js";
import { assertStatus } from "@mittwald/api-client";
import { Flags } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a container stack";
  static resourceName = "container stack";
  static aliases = ["stack:rm"];

  static flags = {
    ...DeleteBaseCommand.baseFlags,
    "with-volumes": Flags.boolean({
      summary: "also include remove volumes in removal",
      description:
        "Only relevant for a project's default stack, which is emptied instead of removed; the volumes of any other stack are removed together with the stack itself.",
      default: false,
      char: "v",
    }),
  };
  static args = { ...stackArgs };

  protected async deleteResource(): Promise<void> {
    const stackId = await this.withStackId(Delete);
    const stackResponse = await this.apiClient.container.getStack({ stackId });
    assertStatus(stackResponse, 200);

    const { id, projectId } = stackResponse.data;

    // A project's default stack cannot be removed; it is emptied instead by
    // declaring it without any services or volumes.
    if (id === projectId) {
      const resp = await this.apiClient.container.declareStack({
        stackId,
        data: {
          services: {},
          volumes: {},
        },
      });
      assertSuccess(resp);

      if (this.flags["with-volumes"]) {
        await this.deleteVolumes(stackId, projectId);
      }

      return;
    }

    const resp = await this.apiClient.container.deleteStack({ stackId });
    assertSuccess(resp);
  }

  protected async deleteVolumes(
    stackId: string,
    projectId: string,
  ): Promise<void> {
    const volumesResponse = await this.apiClient.container.listVolumes({
      projectId,
    });
    assertStatus(volumesResponse, 200);

    for (const volume of volumesResponse.data) {
      if (volume.stackId !== stackId) {
        continue;
      }
      const deleteVolumeResponse = await this.apiClient.container.deleteVolume({
        stackId: stackId,
        volumeId: volume.id,
      });
      assertSuccess(deleteVolumeResponse);
    }
  }
}
