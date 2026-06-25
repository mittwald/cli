import { Args, Flags } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";

type Result = {
  stackId: string;
};

export default class SetUpdateSchedule extends ExecRenderBaseCommand<
  typeof SetUpdateSchedule,
  Result
> {
  static description = "Set the update schedule of a container stack";

  static args = {
    "stack-id": Args.string({
      description: "ID of the stack",
      required: true,
    }),
    schedule: Args.string({
      description: "Cron expression for the update schedule",
      required: true,
    }),
  };

  static flags = {
    ...ExecRenderBaseCommand.baseFlags,
    ...processFlags,
    timezone: Flags.string({
      description:
        "Timezone for the update schedule (for example UTC or Europe/Berlin)",
      required: false,
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Setting stack update schedule");

    const stackId = this.args["stack-id"];

    await p.runStep("updating stack schedule", async () => {
      const response = await this.apiClient.container.setStackUpdateSchedule({
        stackId,
        data: {
          updateSchedule: {
            cron: this.args.schedule,
            timezone: this.flags.timezone,
          },
        },
      });

      assertSuccess(response);
    });

    await p.complete(
      <Success>
        Update schedule for stack {stackId} was successfully set.
      </Success>,
    );

    return { stackId };
  }

  protected render({ stackId }: Result): ReactNode {
    if (this.flags.quiet) {
      return stackId;
    }
  }
}
