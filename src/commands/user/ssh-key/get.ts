import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getSshKey"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a specific SSH key";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "key-id": Args.string({
      description: "The ID of an SSH key",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getSshKey({
      sshKeyId: this.args["key-id"],
    });
  }
}
