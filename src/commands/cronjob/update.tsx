import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";

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
    timeout: Flags.integer({
      description: "Set timeout in seconds after wich the process is killed",
    }),
    url: Flags.string({
      description: "Set url to use on cron job execution",
    }),
    command: Flags.string({
      description: "Set file and parameters to execute on cron job execution",
    }),
    interpreter: Flags.string({
      description: "Set interpreter to use for execution",
      options: ["bash", "php"],
    }),
    ...processFlags,
  };

  protected async exec(): Promise<void> {
    type destinationType =
      | MittwaldAPIV2.Components.Schemas.CronjobCronjobCommand
      | MittwaldAPIV2.Components.Schemas.CronjobCronjobUrl;

    type cronjobUpdatePayload = {
      active: boolean;
      description: string;
      destination: destinationType;
      email: string;
      timeout: number;
      interval: string;
    };

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
      disable,
      enable,
    } = this.flags;

    let cronjobActive: boolean;
    if (enable) {
      cronjobActive = true;
    } else if (disable) {
      cronjobActive = false;
    } else {
      cronjobActive = currentCronjob.data.active as boolean;
    }

    let destination: destinationType = currentCronjob.data
      .destination as destinationType;

    if (url) {
      destination = {
        url,
      };
    } else if (interpreter) {
      let destinationInterpreter = interpreter;
      if (interpreter == "bash") {
        destinationInterpreter = "/bin/bash";
      } else if (interpreter == "php") {
        destinationInterpreter = "/usr/bin/php";
      }

      if (url) {
        destination = { url };
      } else if (interpreter) {
        destination = {
          interpreter: destinationInterpreter,
          path: command as string,
        };
      }
    }

    const data: cronjobUpdatePayload = {
      active: cronjobActive,
      description: description
        ? description
        : (currentCronjob.data.description as string),
      destination: destination,
      email: email ? email : (currentCronjob.data.email as string),
      timeout: timeout ? timeout : (currentCronjob.data.timeout as number),
      interval: interval ? interval : (currentCronjob.data.interval as string),
    };

    await process.runStep("Updating cron job", async () => {
      const response = await this.apiClient.cronjob.updateCronjob({
        cronjobId,
        data,
      });
      assertSuccess(response);
    });

    const successText: string = "Your cron job has successfully been updated.";
    await process.complete(<Success>{successText}</Success>);
  }

  protected render(): ReactNode {
    return true;
  }
}
