/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2AppinstallationsAppInstallationIdStatus.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["retrieveStatus"]>
>;

export abstract class GeneratedAppRetrieveStatus extends GetBaseCommand<
  typeof GeneratedAppRetrieveStatus,
  APIResponse
> {
  static description = "get runtime status of a specific `AppInstallation`";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "app-installation-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.app.retrieveStatus({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.app.retrieveStatus>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
