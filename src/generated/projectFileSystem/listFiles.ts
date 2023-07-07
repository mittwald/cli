/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemFiles.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["projectFileSystem"]["listFiles"]>
>;

export abstract class GeneratedProjectFileSystemListFiles<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedProjectFileSystemListFiles,
  TItem,
  Response
> {
  static description = "Get a Project file's information.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.projectFileSystem.listFiles({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.projectFileSystem.listFiles>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
