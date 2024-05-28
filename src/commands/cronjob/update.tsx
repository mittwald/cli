import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import { processFlags } from "../../rendering/process/process_flags.js";
import assertSuccess from "../../lib/assert_success.js";

type UpdateResult = void;

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update a cron job";
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cronjob to be updated.",
      required: true,
    }),
  };
  static flags = {
    description: Flags.string({
      description: "Set cron job description",
    }),
    interval: Flags.string({
      description: "Set cron job execution interval",
    }),
    disable: Flags.boolean({
      description: "Disable cron job automated execution",
      exclusive: ["enable"],
    }),
    enable: Flags.boolean({
      description: "Enable cron job automated execution",
      exclusive: ["disable"],
    }),
    email: Flags.string({
      description: "Set target email to send error messages to",
    }),
    url: Flags.string({
      description: "Set url to use on cron job execution",
    }),
    command: Flags.string({
      description: "Set command to execute on cron job execution",
    }),
    interpreter: Flags.string({
      description: "Set interpreter to use for execution",
      options: ["/bin/bash", "/usr/bin/php"],
    }),
    ...processFlags,
  };

  protected async exec(): Promise<void> {
    const { "cronjob-id": cronjobId } = this.args;
    const currentCronjob = await this.apiClient.cronjob.getCronjob({
      cronjobId,
    });
    assertSuccess(currentCronjob);
  }

  protected render(): ReactNode {
    return true;
  }
}
