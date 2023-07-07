/* eslint-disable */
/* prettier-ignore */
import { Args } from "@oclif/core";
import { MittwaldAPIV2Client, MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemFiles.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["projectFileSystem"]["listFiles"]>
>;

export abstract class List extends GetBaseCommand<typeof List, APIResponse> {
  // todo: useful description
  static description = "Get a foooooooo.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    projectId: Args.string({
      description: "ID of the Project.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.projectFileSystem.listFiles({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.projectFileSystem.listFiles>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
