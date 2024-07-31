import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../lib/basecommands/GetBaseCommand.js";
import { Args } from "@oclif/core";

export type PathParams = MittwaldAPIV2.Paths.V2UsersUserId.Get.Parameters.Path;
type APIResponse = Awaited<ReturnType<MittwaldAPIV2Client["user"]["getUser"]>>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get profile information for a user.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "user-id": Args.string({
      description:
        "The user ID to get information for; defaults to the special value 'self', which references to the currently authenticated user.",
      default: "self",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getUser({
      userId: this.args["user-id"],
    });
  }
}
