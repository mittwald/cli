/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2AppsAppIdVersionsAppVersionId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["getAppversion"]>
>;

export abstract class GeneratedAppGetAppversion extends GetBaseCommand<
  typeof GeneratedAppGetAppversion,
  APIResponse
> {
  static description = "get a specific `AppVersion`";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "app-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {
    appVersionId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.app.getAppversion({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.app.getAppversion>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
