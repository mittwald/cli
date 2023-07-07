/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2FileTokenRulesToken.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["file"]["getFileTokenRules"]>
>;

export abstract class GeneratedFileGetFileTokenRules extends GetBaseCommand<
  typeof GeneratedFileGetFileTokenRules,
  APIResponse
> {
  static description = "Get a Token's upload rules.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    token: Args.string({
      description: "Token of the Token's upload rules to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.file.getFileTokenRules({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.file.getFileTokenRules>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
