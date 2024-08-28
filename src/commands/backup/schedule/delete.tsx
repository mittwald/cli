import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { Args } from "@oclif/core";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";

export class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a backup schedule";
  static resourceName = "backupSchedule";
  static args = {
    "backup-schedule-id": Args.string({
      description: "ID of schedule to delete",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
  };

  protected async deleteResource(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Deleting backup schedule");
    const projectBackupScheduleId = this.args["backup-schedule-id"];

    const currentBackupSchedule =
      await this.apiClient.backup.getProjectBackupSchedule({
        projectBackupScheduleId,
      });

    if (currentBackupSchedule.data.isSystemBackup) {
      await process.error(
        "The system backup created through this schedule is reserved to restore your project in an emergency. " +
          "It can not be deleted.",
      );
    }

    const response = await this.apiClient.backup.deleteProjectBackupSchedule({
      projectBackupScheduleId,
    });

    assertStatus(response, 204);
  }
}
