import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";

import { projectFlags } from "../../../lib/resources/project/flags.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";

type Result = {
  projectBackupScheduleId: string;
};
type BackupScheduleCreationData = Parameters<
  MittwaldAPIV2Client["backup"]["createProjectBackupSchedule"]
>[0]["data"];

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new backup schedule";
  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      description: "Set the description for the backup schedule",
    }),
    schedule: Flags.string({
      required: true,
      description: "Define the schedule itself",
    }),
    ttl: Flags.string({
      required: true,
      description:
        "Define the backup storage period in days, for through this schedule created backups",
    }),
  };

  protected async exec(): Promise<Result> {
    const process = makeProcessRenderer(
      this.flags,
      "Creating a new backup schedule",
    );
    const projectId = await this.withProjectId(Create);
    const { description, schedule, ttl } = this.flags;

    const backupScheduleCreationPayload: BackupScheduleCreationData = {
      schedule,
      ttl,
    };

    if (description) {
      backupScheduleCreationPayload.description = description;
    }

    const { id: projectBackupScheduleId } = await process.runStep(
      "creating backup schedule",
      async () => {
        const r = await this.apiClient.backup.createProjectBackupSchedule({
          projectId,
          data: backupScheduleCreationPayload,
        });
        assertStatus(r, 201);
        return r.data;
      },
    );

    const projectBackupSchedule = await process.runStep(
      "checking newly created backup schedule",
      async () => {
        const r = await this.apiClient.backup.getProjectBackupSchedule({
          projectBackupScheduleId,
        });
        assertStatus(r, 200);
        return r.data;
      },
    );

    if (description) {
      await process.complete(
        <Success>
          The backup schedule "
          <Value>{projectBackupSchedule.description}</Value>" was successfully
          created.
        </Success>,
      );
    } else {
      await process.complete(
        <Success>The backup schedule was successfully created.</Success>,
      );
    }

    return { projectBackupScheduleId };
  }

  protected render({ projectBackupScheduleId }: Result): ReactNode {
    if (this.flags.quiet) {
      return projectBackupScheduleId;
    }
  }
}
