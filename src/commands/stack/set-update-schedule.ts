import { Args, Flags } from "@oclif/core";
import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";

export default class SetUpdateSchedule extends BaseCommand {
  static description = "Set the update schedule of a container stack";

  static args = {
    "stack-id": Args.string({
      description: "ID of the stack",
      required: true,
    }),
    schedule: Args.string({
      description: "Cron expression for the update schedule (validated by API)",
      required: true,
    }),
  };

  static flags = {
    ...BaseCommand.baseFlags,
    timezone: Flags.string({
      description:
        "Timezone for the update schedule (for example UTC or Europe/Berlin; validated by API)",
      required: false,
    }),
  };
  async run(): Promise<void> {
    const { args, flags } = await this.parse(SetUpdateSchedule);

    const response = await this.apiClient.container.setStackUpdateSchedule({
      stackId: args["stack-id"],
      data: {
        updateSchedule: {
          cron: args.schedule,
          timezone: flags.timezone,
        },
      },
    });

    assertSuccess(response);
  }
}
