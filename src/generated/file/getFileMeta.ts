/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2FilesIdMeta.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["file"]["getFileMeta"]>
>;

export abstract class GeneratedFileGetFileMeta extends GetBaseCommand<
  typeof GeneratedFileGetFileMeta,
  APIResponse
> {
  static description = "Get a File's meta.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    id: Flags.string({
      description: "ID of the File to get the meta for.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.file.getFileMeta({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.file.getFileMeta>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
