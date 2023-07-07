/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SignupProfile.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getOwnProfile"]>
>;

export abstract class GeneratedUserGetOwnProfile extends GetBaseCommand<
  typeof GeneratedUserGetOwnProfile,
  APIResponse
> {
  static description = "Get your profile information";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getOwnProfile({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.user.getOwnProfile>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
