import { Args } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { ReactNode } from "react";

export default class UnsetUpdateSchedule extends ExecRenderBaseCommand<
  typeof UnsetUpdateSchedule,
  void
> {
  static description = "Unset the update schedule of a container stack";

  static args = {
    "stack-id": Args.string({
      description: "ID of the stack",
      required: true,
    }),
  };

  protected async exec(): Promise<void> {
    const response = await this.apiClient.container.setStackUpdateSchedule({
      stackId: this.args["stack-id"],
      data: {
        updateSchedule: null as unknown as { cron: string; timezone?: string },
      },
    });

    assertSuccess(response);
  }

  protected render(): ReactNode {
    return null;
  }
}
