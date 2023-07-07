/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2AppinstallationsAppInstallationId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["getAppinstallation"]>
>;

export abstract class GeneratedAppGetAppinstallation extends GetBaseCommand<
  typeof GeneratedAppGetAppinstallation,
  APIResponse
> {
  static description = "get a specific `AppInstallation`";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    appInstallationId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.app.getAppinstallation({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.app.getAppinstallation>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
