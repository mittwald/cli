import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { Args, Flags } from "@oclif/core";
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
    }),
  };
  static flags = {
    ...processFlags,
    "backup-schedule-id": Flags.string({
      description: "ID of backup schedule to delete",
    }),
  };

  protected async deleteResource(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating backup schedule");

    // TODO: implement withBackupScheduleId
    let projectBackupScheduleId: string = "";
    if (this.flags["backup-schedule-id"]) {
      projectBackupScheduleId = this.flags["backup-schedule-id"];
    } else if (this.args["backup-schedule-id"]) {
      projectBackupScheduleId = this.args["backup-schedule-id"];
    } else {
      await process.error(
        "Please provide a backup schedule id as flag or argument",
      );
    }

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
