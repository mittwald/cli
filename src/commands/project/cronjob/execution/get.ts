/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../../GetBaseCommand.js";
import { Args } from "@oclif/core";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["getExecution"]>
>;

export class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a cron job execution.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };

  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cronjob the execution belongs to",
      required: true,
    }),
    "execution-id": Args.string({
      description: "ID of the cronjob execution to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    const pathParameters = {
      executionId: this.args["execution-id"],
      cronjobId: this.args["cronjob-id"],
    };
    return await this.apiClient.cronjob.getExecution(pathParameters);
  }
}
