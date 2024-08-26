import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";

type UpdateResult = void;
type backupScheduleUpdatePayload = Parameters<
  MittwaldAPIV2Client["backup"]["updateProjectBackupSchedule"]
>[0]["data"];

export default class Create extends ExecRenderBaseCommand<
  typeof Create,
  UpdateResult
> {
  static description = "Update an existing backup schedule";
  static flags = {
    ...processFlags,
    "backup-schedule-id": Flags.string({
      description: "Define the backup schedule that is to be updated",
      required: true,
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
    const {
      "backup-schedule-id": projectBackupScheduleId,
      description,
      schedule,
      ttl,
    } = this.flags;

    const backupScheduleUpdatePayload: backupScheduleUpdatePayload = {};

    if (description) {
      backupScheduleUpdatePayload.description = description;
    }

    if (schedule) {
      backupScheduleUpdatePayload.schedule = schedule;
    }

    if (ttl) {
      backupScheduleUpdatePayload.ttl = ttl;
    }

    if (Object.keys(backupScheduleUpdatePayload).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
    } else {
      await process.runStep("Updating backup schedule", async () => {
        const response =
          await this.apiClient.backup.updateProjectBackupSchedule({
            projectBackupScheduleId,
            data: backupScheduleUpdatePayload,
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
