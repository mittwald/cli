/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2AppsAppIdVersions.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listAppversions"]>
>;

export abstract class GeneratedAppListAppversions<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedAppListAppversions, TItem, Response> {
  static description = "get all `AppVersions` of a specific `App`";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "app-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      appId: this.flags["app-id"],
    };
    return await this.apiClient.app.listAppversions({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.app.listAppversions>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
