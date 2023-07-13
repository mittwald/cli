/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2AppsAppId.Get.Parameters.Path;
type APIResponse = Awaited<ReturnType<MittwaldAPIV2Client["app"]["getApp"]>>;

export abstract class GeneratedAppGetApp extends GetBaseCommand<
  typeof GeneratedAppGetApp,
  APIResponse
> {
  static description = "get a specific `App`";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    appId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.app.getApp({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.app.getApp>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
