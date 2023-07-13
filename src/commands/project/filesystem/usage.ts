import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { projectArgs, withProjectId } from "../../../lib/project/flags.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdFilesystemUsagesDisk.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["projectFileSystem"]["getDiskUsage"]>
>;

export class Usage extends GetBaseCommand<
  typeof Usage,
  APIResponse
> {
  static description = "Get a Project directory filesystem usage.";

  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected async getData(): Promise<APIResponse> {
    const projectId = await withProjectId(this.apiClient, this.flags, this.args, this.config);
    return await this.apiClient.projectFileSystem.getDiskUsage({
      pathParameters: {projectId},
    } as Parameters<typeof this.apiClient.projectFileSystem.getDiskUsage>[0]);
  }
}
