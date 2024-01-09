import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Args } from "@oclif/core";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import assertSuccess from "../../../lib/assert_success.js";

type Result = {
  executionId: string;
};

export class Abort extends ExecRenderBaseCommand<typeof Abort, Result> {
  static summary = "Abort a running cron job execution.";
  static flags = {
    ...processFlags,
  };
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cronjob the execution belongs to",
      required: true,
    }),
    "execution-id": Args.string({
      required: true,
      description: "ID of the cron job execution to abort",
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Aborting a cron job execution");
    const { "cronjob-id": cronjobId, "execution-id": executionId } = this.args;

    await p.runStep("aborting cron job execution", async () => {
      const r = await this.apiClient.cronjob.abortExecution({
        cronjobId,
        executionId,
      });

      assertSuccess(r);
    });

    p.complete(
      <Success>
        Execution <Value>{executionId}</Value> was successfully aborted.
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
