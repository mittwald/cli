/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CronjobsCronjobIdExecutionsExecutionId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["getExecution"]>
>;

export abstract class GeneratedCronjobGetExecution extends GetBaseCommand<
  typeof GeneratedCronjobGetExecution,
  APIResponse
> {
  static description = "Get a CronjobExecution.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "cronjob-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {
    executionId: Args.string({
      description: "ID of the CronjobExecution to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.cronjob.getExecution({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.cronjob.getExecution>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
