/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SystemsoftwareSystemSoftwareIdVersionsSystemSoftwareVersionId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["getSystemsoftwareversion"]>
>;

export abstract class GeneratedAppGetSystemsoftwareversion extends GetBaseCommand<
  typeof GeneratedAppGetSystemsoftwareversion,
  APIResponse
> {
  static description = "get a specific `SystemSoftwareVersion`";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "system-software-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {
    systemSoftwareVersionId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.app.getSystemsoftwareversion({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.app.getSystemsoftwareversion>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
