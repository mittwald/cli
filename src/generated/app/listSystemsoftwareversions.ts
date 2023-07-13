/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SystemsoftwareSystemSoftwareIdVersions.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listSystemsoftwareversions"]>
>;

export abstract class GeneratedAppListSystemsoftwareversions<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedAppListSystemsoftwareversions,
  TItem,
  Response
> {
  static description =
    "get all available `SystemSoftwareVersions` of a specific `SystemSoftware`";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "system-software-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      systemSoftwareId: this.flags["system-software-id"],
    };
    return await this.apiClient.app.listSystemsoftwareversions({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.app.listSystemsoftwareversions>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
