import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { projectFlags } from "../../lib/project/flags.js";
import React, { ReactNode } from "react";
import { Flags } from "@oclif/core";
import {
  expirationDateFromFlags,
  expireFlagsRequired,
} from "../../lib/expires.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { waitFlags, waitUntil } from "../../lib/wait.js";
import { Text } from "ink";

type CreateResult = {
  backupId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, CreateResult> {
  static summary = "Create a new backup of a project";
  static flags = {
    ...processFlags,
    ...projectFlags,
    description: Flags.string({
      description: "a description for the backup.",
    }),
    ...expireFlagsRequired("backup"),
    ...waitFlags,
  };

  static aliases = ["project:backup:create"];
  static deprecateAliases = true;

  protected async exec(): Promise<CreateResult> {
    const p = makeProcessRenderer(this.flags, "Creating backup");
    const projectId = await this.withProjectId(Create);
    const { description } = this.flags;
    const expirationTime = expirationDateFromFlags(this.flags);

    const backup = await p.runStep("creating backup", async () => {
      const r = await this.apiClient.backup.createProjectBackup({
        projectId,
        data: {
          description,
          expirationTime: expirationTime.toJSON(),
        },
      });

      assertStatus(r, 201);

      return r.data;
    });

    if (this.flags.wait) {
      const stepWaiting = p.addStep(
        <Text>waiting for backup to be complete</Text>,
      );

      await waitUntil(async () => {
        const backupResponse = await this.apiClient.backup.getProjectBackup({
          projectBackupId: backup.id,
        });

        if (
          backupResponse.status === 200 &&
          backupResponse.data.status === "Completed"
        ) {
          return true;
        }
      }, this.flags["wait-timeout"]);

      stepWaiting.complete();
    }

    p.complete(<Success>Backup successfully created.</Success>);

    return { backupId: backup.id };
  }

  protected render(executionResult: CreateResult): ReactNode {
    if (this.flags.quiet) {
      return executionResult.backupId;
    }
  }
}
