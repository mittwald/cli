import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getProjectInvite"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a ProjectInvite.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "invite-id": Args.string({
      description: "ID of the ProjectInvite to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.project.getProjectInvite({
      inviteId: this.args["invite-id"],
    });
  }
}
