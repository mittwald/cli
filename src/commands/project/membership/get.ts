import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getProjectMembership"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a ProjectMembership";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "membership-id": Args.string({
      description: "ID of the ProjectMembership to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.project.getProjectMembership({
      membershipId: this.args["membership-id"],
    });
  }
}
