/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2Apps.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listApps"]>
>;

export abstract class GeneratedAppListApps<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedAppListApps, TItem, Response> {
  static description = "get all available `Apps`";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.app.listApps({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.app.listApps>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
