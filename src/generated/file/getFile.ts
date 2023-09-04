/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2FilesId.Get.Parameters.Path;
type APIResponse = Awaited<ReturnType<MittwaldAPIV2Client["file"]["getFile"]>>;

export abstract class GeneratedFileGetFile extends GetBaseCommand<
  typeof GeneratedFileGetFile,
  APIResponse
> {
  static description = "Get a File.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "ID of the File to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.file.getFile({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.file.getFile>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
