import { Args } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { createElement, ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";

type Result = {
  stackId: string;
};

export default class UnsetUpdateSchedule extends ExecRenderBaseCommand<
  typeof UnsetUpdateSchedule,
  Result
> {
  static description = "Unset the update schedule of a container stack";

  static args = {
    "stack-id": Args.string({
      description: "ID of the stack",
      required: true,
    }),
  };

  static flags = {
    ...ExecRenderBaseCommand.baseFlags,
    ...processFlags,
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(
      this.flags,
      "Unsetting stack update schedule",
    );

    const stackId = this.args["stack-id"];

    await p.runStep("removing stack schedule", async () => {
      const response = await this.apiClient.container.setStackUpdateSchedule({
        stackId,
        data: {
          updateSchedule: null as unknown as {
            cron: string;
            timezone?: string;
          },
        },
      });

      assertSuccess(response);
    });

    await p.complete(
      createElement(
        Success,
        null,
        `Update schedule for stack ${stackId} was successfully removed.`,
      ),
    );

    return { stackId };
  }

  protected render({ stackId }: Result): ReactNode {
    if (this.flags.quiet) {
      return stackId;
    }
  }
}
