/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { GeneratedCronjobGetExecution } from "../../../../generated/cronjob/getExecution.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../../GetBaseCommand.js";
import { Args, Flags } from "@oclif/core";

export type PathParams =
  MittwaldAPIV2.Paths.V2CronjobsCronjobIdExecutionsExecutionId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["getExecution"]>
>;

export class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a CronjobExecution.";

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
    return await this.apiClient.cronjob.getExecution({
      ...pathParameters,
    } as Parameters<typeof this.apiClient.cronjob.getExecution>[0]);
  }
}
