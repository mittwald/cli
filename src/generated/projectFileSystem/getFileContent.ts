/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemFilesRaw.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["projectFileSystem"]["getFileContent"]>
>;

export abstract class GeneratedProjectFileSystemGetFileContent extends GetBaseCommand<
  typeof GeneratedProjectFileSystemGetFileContent,
  APIResponse
> {
  static description = "Get a Project file's content.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.projectFileSystem.getFileContent({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.projectFileSystem.getFileContent>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
