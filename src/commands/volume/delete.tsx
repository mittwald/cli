import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Args, Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

type Result = {
  volumeName: string;
};

export class Delete extends ExecRenderBaseCommand<typeof Delete, Result> {
  static summary = "Remove one or more volumes";
  static description =
    "Removes named volumes from the project stack. Be careful as this will permanently delete the volume data.";

  static aliases = ["volume:rm"];

  static flags = {
    ...projectFlags,
    ...processFlags,
    force: Flags.boolean({
      summary: "force removal without confirmation",
      char: "f",
      default: false,
    }),
  };

  static args = {
    name: Args.string({
      description: "name of the volume to remove",
      required: true,
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(this.flags, "Removing volume");
    const projectId = await this.withProjectId(Delete);
    const stackId = projectId; // In mStudio, project and stack are the same for volumes
    const { name: volumeName } = this.args;

    // Get current stack state
    const currentStack = await process.runStep(
      "getting current stack state",
      async () => {
        const r = await this.apiClient.container.getStack({ stackId });
        assertStatus(r, 200);
        return r.data;
      },
    );

    // Check if volume exists
    if (
      !currentStack.volumes ||
      !(currentStack.volumes || []).some((v) => v.name === volumeName)
    ) {
      throw new Error(`Volume "${volumeName}" does not exist`);
    }

    // Check if volume is in use by any services
    const volumeInUse = this.checkVolumeInUse(
      currentStack.services,
      volumeName,
    );
    if (volumeInUse && !this.flags.force) {
      throw new Error(
        `Volume "${volumeName}" is in use by one or more containers. Use --force to remove anyway.`,
      );
    }

    // Delete the actual volume data if it exists
    await process.runStep("deleting volume", async () => {
      const volumesResponse = await this.apiClient.container.listVolumes({
        projectId,
      });
      assertStatus(volumesResponse, 200);

      const volume = volumesResponse.data.find(
        (v) => v.name === volumeName && v.stackId === stackId,
      );

      if (volume) {
        const deleteResponse = await this.apiClient.container.deleteVolume({
          stackId,
          volumeId: volume.id,
        });
        assertStatus(deleteResponse, 204);
      }
    });

    await process.complete(
      <Success>
        Volume <Value>{volumeName}</Value> was successfully removed.
      </Success>,
    );

    return { volumeName };
  }

  private checkVolumeInUse(
    services: Array<{ deployedState?: { volumes?: string[] } }> | undefined,
    volumeName: string,
  ): boolean {
    if (!services) {
      return false;
    }

    for (const service of services) {
      const volumes = service.deployedState?.volumes;
      if (volumes) {
        for (const volumeMount of volumes) {
          // Check if this is a named volume (not a bind mount)
          if (
            volumeMount.includes(":") &&
            volumeMount.split(":")[0] === volumeName
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  protected render({ volumeName }: Result): ReactNode {
    if (this.flags.quiet) {
      return volumeName;
    }
  }
}
