import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getSession"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a specific session";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "token-id": Args.string({
      description: "Token ID to identify the specific session",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getSession({
      tokenId: this.args["token-id"],
    });
  }
}
