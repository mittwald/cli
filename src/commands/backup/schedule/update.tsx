import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";
import { backupScheduleFlagDefinitions } from "../../../lib/resources/backup/schedule/flags.js";

type UpdateResult = void;
type backupScheduleUpdatePayload = Parameters<
  MittwaldAPIV2Client["backup"]["updateProjectBackupSchedule"]
>[0]["data"];

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing backup schedule";
  static args = {
    "backup-schedule-id": Args.string({
      description: "Define the backup schedule that is to be updated",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    description: backupScheduleFlagDefinitions.description(),
    schedule: backupScheduleFlagDefinitions.schedule(),
    ttl: backupScheduleFlagDefinitions.ttl(),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating backup schedule");
    const projectBackupScheduleId = this.args["backup-schedule-id"];
    const { description, schedule, ttl } = this.flags;

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
      return;
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
      return;
    }
  }

  protected render(): ReactNode {
    return true;
  }
}
