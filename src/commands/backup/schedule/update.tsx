import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Flags, Args } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";

type UpdateResult = void;

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  UpdateResult
> {
  static description = "Update an existing backup schedule";
  static args = {
    "backup-schedule-id": Args.string({
      description: "Define the backup schedule that is to be updated",
    }),
  };
  static flags = {
    ...processFlags,
    "backup-schedule-id": Flags.string({
      description: "Define the backup schedule that is to be updated",
    }),
    description: Flags.string({
      description: "Set the description for the backup schedule",
    }),
    schedule: Flags.string({
      description: "Define the schedule itself",
    }),
    ttl: Flags.string({
      description:
        "Define the backup storage period in days, for through this schedule created backups",
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating backup schedule");

    // TODO: implement withBackupScheduleId()
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

    const { description, schedule, ttl } = this.flags;

    const backupScheduleCreatePayload: {
      description?: string | undefined;
      schedule?: string | undefined;
      ttl?: string | undefined;
    } = {};

    if (description) {
      backupScheduleCreatePayload.description = description;
    }

    if (schedule) {
      backupScheduleCreatePayload.schedule = schedule;
    }

    if (ttl) {
      backupScheduleCreatePayload.ttl = ttl;
    }

    if (Object.keys(backupScheduleCreatePayload).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
    } else {
      await process.runStep("Updating backup schedule", async () => {
        const response =
          await this.apiClient.backup.updateProjectBackupSchedule({
            projectBackupScheduleId,
            data: backupScheduleCreatePayload,
          });
        assertSuccess(response);
      });

      await process.complete(
        <Success>Your backup schedule has successfully been updated.</Success>,
      );
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
