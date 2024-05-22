import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getSelfMembershipForProject"]>
>;

export default class GetOwn extends GetBaseCommand<typeof GetOwn, APIResponse> {
  static description = "Get the executing user's membership in a Project.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    ...projectFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    const projectId = await withProjectId(
      this.apiClient,
      GetOwn,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.project.getSelfMembershipForProject({
      projectId,
    });
  }
}
