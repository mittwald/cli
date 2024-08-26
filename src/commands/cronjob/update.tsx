import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args, Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";

type UpdateResult = void;
type CronjobUpdateData = Parameters<
  MittwaldAPIV2Client["cronjob"]["updateCronjob"]
>[0]["data"];

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

    const updateCronjobPayload: CronjobUpdateData = {};

    if (enable) {
      updateCronjobPayload.active = true;
    } else if (disable) {
      updateCronjobPayload.active = false;
    }

    if (url) {
      updateCronjobPayload.destination = { url };
    } else if (interpreter) {
      let destinationInterpreter = interpreter;
      if (interpreter == "bash") {
        destinationInterpreter = "/bin/bash";
      } else if (interpreter == "php") {
        destinationInterpreter = "/usr/bin/php";
      }

      updateCronjobPayload.destination = {
        interpreter: destinationInterpreter,
        path: command as string,
      };
    }

    if (description) {
      updateCronjobPayload.description = description;
    }

    if (timeout) {
      updateCronjobPayload.timeout = timeout;
    }

    if (email) {
      updateCronjobPayload.email = email;
    }

    if (interval) {
      updateCronjobPayload.interval = interval;
    }

    await process.runStep("Updating cron job", async () => {
      const response = await this.apiClient.cronjob.updateCronjob({
        cronjobId,
        data: updateCronjobPayload,
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
