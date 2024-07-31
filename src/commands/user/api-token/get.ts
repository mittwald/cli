import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getApiToken"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a specific API token";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "token-id": Args.string({
      description: "The ID of an API token",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getApiToken({
      apiTokenId: this.args["token-id"],
    });
  }
}
