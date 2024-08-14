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
    backupScheduleId: Args.string({
      description: "ID of schedule to delete",
    }),
  };
  static flags = {
    ...processFlags,
    backupScheduleId: Flags.string({
      description: "ID of backup schedule to delete",
    }),
  };

  protected async deleteResource(): Promise<void> {
    // TODO: implement withBackupScheduleId()

    const process = makeProcessRenderer(this.flags, "Updating backup schedule");
    let projectBackupScheduleId: string = "";
    if (this.flags.backupScheduleId) {
      projectBackupScheduleId = this.flags.backupScheduleId;
    } else if (this.args.backupScheduleId) {
      projectBackupScheduleId = this.args.backupScheduleId;
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
