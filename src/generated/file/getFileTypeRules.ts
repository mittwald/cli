/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2FileTypeRulesName.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["file"]["getFileTypeRules"]>
>;

export abstract class GeneratedFileGetFileTypeRules extends GetBaseCommand<
  typeof GeneratedFileGetFileTypeRules,
  APIResponse
> {
  static description = "Get a Type's upload rules.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    name: Args.string({
      description: "Name of the Type's upload rules to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.file.getFileTypeRules({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.file.getFileTypeRules>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
