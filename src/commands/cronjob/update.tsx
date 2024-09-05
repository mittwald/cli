import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { cronjobFlagDefinitions } from "../../lib/resources/cronjob/flags.js";
import { buildCronjobDestination } from "../../lib/resources/cronjob/destination.js";
import Duration from "../../lib/units/Duration.js";

type UpdateResult = void;

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Update an existing cron job";
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cron job to be updated.",
      required: true,
    }),
  };
  static flags = {
    ...processFlags,
    description: cronjobFlagDefinitions.description(),
    interval: cronjobFlagDefinitions.interval(),
    email: cronjobFlagDefinitions.email(),
    url: cronjobFlagDefinitions.url({
      exclusive: ["command"],
    }),
    command: cronjobFlagDefinitions.command({
      exclusive: ["url"],
      dependsOn: ["interpreter"],
    }),
    interpreter: cronjobFlagDefinitions.interpreter({
      dependsOn: ["command"],
    }),
    enable: Flags.boolean({
      exclusive: ["disable"],
      summary: "Enable the cron job.",
      description:
        "Set the status of the cron job to inactive. Automatic execution will be disabled.",
    }),
    disable: Flags.boolean({
      exclusive: ["enable"],
      summary: "Disable the cron job.",
      description:
        "Set the status of the cron job to active. Automatic execution will be enabled.",
    }),
    timeout: Duration.relativeFlag({
      summary: "Timeout after which the process will be killed.",
      description:
        "Common duration formats are supported (for example, '1h', '30m', '30s'). " +
        "Defines the amount of time after which a running cron job will be killed. " +
        "If an email address is defined, an error message will be sent.",
      required: false,
    }),
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(this.flags, "Updating cron job");
    const { "cronjob-id": cronjobId } = this.args;
    const currentCronjob = await this.apiClient.cronjob.getCronjob({
      cronjobId,
    });
    assertSuccess(currentCronjob);

    const {
      description,
      interval,
      email,
      timeout,
      url,
      interpreter,
      command,
      enable,
      disable,
    } = this.flags;

    if (Object.keys(this.flags).length == 0) {
      await process.complete(
        <Success>Nothing to change. Have a good day!</Success>,
      );
      return;
    }

    await process.runStep("Updating cron job", async () => {
      const response = await this.apiClient.cronjob.updateCronjob({
        cronjobId,
        data: {
          destination:
            url || command
              ? buildCronjobDestination(url, command, interpreter)
              : undefined,
          active: enable ? true : disable ? false : undefined,
          description,
          timeout: timeout?.seconds,
          email,
          interval,
        },
      });
      assertSuccess(response);
    });

    await process.complete(
      <Success>Your cron job has successfully been updated.</Success>,
    );
  }

  protected render(): ReactNode {
    return true;
  }
}
