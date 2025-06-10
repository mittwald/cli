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
      summary: "also remove volumes",
      default: false,
      char: "v",
    }),
  };
  static args = { ...stackArgs };

  protected async deleteResource(): Promise<void> {
    const stackId = await this.withStackId(Delete);
    const stackResponse = await this.apiClient.container.getStack({ stackId });
    assertStatus(stackResponse, 200);

    if (stackResponse.data.projectId !== stackResponse.data.id) {
      throw new Error("not implemented");
    }

    const resp = await this.apiClient.container.declareStack({
      stackId,
      data: {
        services: {},
        volumes: {},
      },
    });

    assertSuccess(resp);

    if (this.flags["with-volumes"]) {
      await this.deleteVolumes(stackId, stackResponse.data.projectId);
    }
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
