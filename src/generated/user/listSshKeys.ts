/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2UsersSelfSshKeys.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["listSshKeys"]>
>;

export abstract class GeneratedUserListSshKeys<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedUserListSshKeys, TItem, Response> {
  static description = "Get your stored ssh keys";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.user.listSshKeys({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.user.listSshKeys>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
