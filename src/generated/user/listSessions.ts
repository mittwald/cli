/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2UsersSelfSessions.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["listSessions"]>
>;

export abstract class GeneratedUserListSessions<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<typeof GeneratedUserListSessions, TItem, Response> {
  static description = "List all active sessions";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.user.listSessions({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.user.listSessions>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
