import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";

type Result = {
  executionId: string;
};

export class Execute extends ExecRenderBaseCommand<typeof Execute, Result> {
  static summary = "Manually run a cron job";
  static flags = {
    ...processFlags,
  };
  static args = {
    "cronjob-id": Args.string({
      required: true,
      summary: "ID of the cron job to run",
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Running a cron job");
    const { "cronjob-id": cronjobId } = this.args;

    const cronjob = await p.runStep("getting cron job", async () => {
      const r = await this.apiClient.cronjob.getCronjob({ cronjobId });
      assertStatus(r, 200);
      return r.data;
    });

    const { id: executionId } = await p.runStep(
      "running cron job",
      async () => {
        const r = await this.apiClient.cronjob.createExecution({
          cronjobId,
        });

        assertStatus(r, 201);
        return r.data;
      },
    );

    p.complete(
      <Success>
        An execution for cron job <Value>{cronjob.shortId}</Value> was
        successfully created. Execution ID: <Value>{executionId}</Value>
      </Success>,
    );

    return { executionId };
  }

  protected render({ executionId }: Result): ReactNode {
    if (this.flags.quiet) {
      return executionId;
    }
  }
}
