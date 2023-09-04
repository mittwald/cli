/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2Servers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listServers"]>
>;

export abstract class GeneratedProjectListServers<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedProjectListServers, TItem, Response> {
  static description = "List Servers for an Organization or User.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.project.listServers({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.project.listServers>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
