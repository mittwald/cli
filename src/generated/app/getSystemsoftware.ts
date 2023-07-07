/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SystemsoftwaresSystemSoftwareId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["getSystemsoftware"]>
>;

export abstract class GeneratedAppGetSystemsoftware extends GetBaseCommand<
  typeof GeneratedAppGetSystemsoftware,
  APIResponse
> {
  static description = "get a specific `SystemSoftware`";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    systemSoftwareId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.app.getSystemsoftware({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.app.getSystemsoftware>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
