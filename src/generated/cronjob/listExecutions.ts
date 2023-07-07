/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CronjobsCronjobIdExecutions.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["listExecutions"]>
>;

export abstract class GeneratedCronjobListExecutions<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedCronjobListExecutions,
  TItem,
  Response
> {
  static description = "List CronjobExecutions belonging to a Cronjob.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "cronjob-id": Flags.string({
      description: "ID of the Cronjob for which to list CronjobExecutions for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      cronjobId: this.flags["cronjob-id"],
    };
    return await this.apiClient.cronjob.listExecutions({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.cronjob.listExecutions>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
