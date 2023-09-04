/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2UsersUserId.Get.Parameters.Path;
type APIResponse = Awaited<ReturnType<MittwaldAPIV2Client["user"]["getUser"]>>;

export abstract class GeneratedUserGetUser extends GetBaseCommand<
  typeof GeneratedUserGetUser,
  APIResponse
> {
  static description = "Get profile information for a user.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getUser({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.user.getUser>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
