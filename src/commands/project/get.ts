/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { projectArgs, withProjectId } from "../../lib/project/flags.js";

export type PathParams = MittwaldAPIV2.Paths.V2ProjectsId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getProject"]>
>;

export class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a Project.";

  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected async getData(): Promise<APIResponse> {
    const id = await withProjectId(this.apiClient, this.flags, this.args, this.config);
    return await this.apiClient.project.getProject({
      pathParameters: { id },
    });
  }

}
