import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete an SSH key";
  static resourceName = "SSH key";

  static args = {
    id: Args.string({
      required: true,
      description: "ID of the SSH key to be deleted.",
    }),
  };

  static flags = { ...DeleteBaseCommand.baseFlags };

  protected async deleteResource(): Promise<void> {
    const { args } = await this.parse(Delete);
    const { id } = args;

    const response = await this.apiClient.user.deleteSshKey({
      sshKeyId: id,
    });

    assertStatus(response, 204);
  }
}
