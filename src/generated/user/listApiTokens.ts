/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2UsersSelfApiTokens.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["listApiTokens"]>
>;

export abstract class GeneratedUserListApiTokens<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedUserListApiTokens, TItem, Response> {
  static description = "List all ApiTokens of the user";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.user.listApiTokens({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.user.listApiTokens>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
