/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemUsagesDisk.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["projectFileSystem"]["getDiskUsage"]>
>;

export abstract class GeneratedProjectFileSystemGetDiskUsage extends GetBaseCommand<
  typeof GeneratedProjectFileSystemGetDiskUsage,
  APIResponse
> {
  static description = "Get a Project directory filesystem usage.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.projectFileSystem.getDiskUsage({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.projectFileSystem.getDiskUsage>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
