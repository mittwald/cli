/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemDirectories.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["projectFileSystem"]["getDirectories"]>
>;

export abstract class GeneratedProjectFileSystemGetDirectories extends GetBaseCommand<
  typeof GeneratedProjectFileSystemGetDirectories,
  APIResponse
> {
  static description = "List the directories of a Project.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project to list the directories for.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.projectFileSystem.getDirectories({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.projectFileSystem.getDirectories>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
