import { Args } from "@oclif/core";
import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";

export default class UnsetUpdateSchedule extends BaseCommand {
  static description = "Unset the update schedule of a container stack";

  static args = {
    "stack-id": Args.string({
      description: "ID of the stack",
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(UnsetUpdateSchedule);

    const response = await this.apiClient.container.setStackUpdateSchedule({
      stackId: args["stack-id"],
      data: {
        updateSchedule: null as unknown as { cron: string; timezone?: string },
      },
    });

    assertSuccess(response);
  }
}
