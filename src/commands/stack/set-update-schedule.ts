import { Args, Flags } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { ReactNode } from "react";

export default class SetUpdateSchedule extends ExecRenderBaseCommand<
  typeof SetUpdateSchedule,
  void
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
    timezone: Flags.string({
      description:
        "Timezone for the update schedule (for example UTC or Europe/Berlin)",
      required: false,
    }),
  };

  protected async exec(): Promise<void> {
    const response = await this.apiClient.container.setStackUpdateSchedule({
      stackId: this.args["stack-id"],
      data: {
        updateSchedule: {
          cron: this.args.schedule,
          timezone: this.flags.timezone,
        },
      },
    });

    assertSuccess(response);
  }

  protected render(): ReactNode {
    return null;
  }
}
