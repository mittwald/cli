/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2UsersSelfApiTokens.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getApiToken"]>
>;

export abstract class GeneratedUserGetApiToken extends GetBaseCommand<
  typeof GeneratedUserGetApiToken,
  APIResponse
> {
  static description = "Get a specific ApiToken";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    apiTokenId: Args.string({
      description: "The uuid of an ApiToken",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getApiToken({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.user.getApiToken>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
