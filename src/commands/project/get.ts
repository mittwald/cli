import { GetBaseCommand } from "../../GetBaseCommand.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { projectArgs, withProjectId } from "../../lib/project/flags.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getProject"]>
>;

export class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a Project.";

  static flags = { ...GetBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected async getData(): Promise<APIResponse> {
    const id = await withProjectId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.project.getProject({
      pathParameters: { id },
    });
  }
}
