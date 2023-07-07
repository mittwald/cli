/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CronjobsCronjobId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["getCronjob"]>
>;

export abstract class GeneratedCronjobGetCronjob extends GetBaseCommand<
  typeof GeneratedCronjobGetCronjob,
  APIResponse
> {
  static description = "Get a Cronjob.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    cronjobId: Args.string({
      description: "ID of the Cronjob to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.cronjob.getCronjob({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.cronjob.getCronjob>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
