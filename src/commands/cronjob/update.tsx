import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { Args } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import type { MittwaldAPIV2Client } from "@mittwald/api-client";
import { cronjobFlagDefinitions } from "../../lib/resources/cronjob/flags.js";

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
    ...processFlags,
    description: cronjobFlagDefinitions.description(),
    interval: cronjobFlagDefinitions.interval(),
    email: cronjobFlagDefinitions.email(),
    timeout: cronjobFlagDefinitions.timeout(),
    url: cronjobFlagDefinitions.url(),
    interpreter: cronjobFlagDefinitions.interpreter(),
    command: cronjobFlagDefinitions.command(),
    active: cronjobFlagDefinitions.active(),
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
      active,
    } = this.flags;

    const updateCronjobPayload: CronjobUpdateData = {};

    if (url) {
      updateCronjobPayload.destination = { url };
    } else if (interpreter) {
      let destinationInterpreter;
      if (interpreter == "bash") {
        destinationInterpreter = "/bin/bash";
      } else {
        destinationInterpreter = "/usr/bin/php";
      }

      updateCronjobPayload.destination = {
        interpreter: destinationInterpreter,
        path: command as string,
      };
    }

    if (active) {
      updateCronjobPayload.active = active;
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