/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SignupSessionsTokenId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getSession"]>
>;

export abstract class GeneratedUserGetSession extends GetBaseCommand<
  typeof GeneratedUserGetSession,
  APIResponse
> {
  static description = "Get a specific Session";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    tokenId: Args.string({
      description: "tokenId to identify the concrete Session",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getSession({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.user.getSession>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
