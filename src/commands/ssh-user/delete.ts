import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import assertSuccess from "../../lib/assert_success.js";
import { Args } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete an SSH user";
  static resourceName = "SSH user";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "ssh-user-id": Args.string({
      description: "The ID of the SSH user to delete",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const sshUserId = this.args["ssh-user-id"];
    const response = await this.apiClient.sshsftpUser.sshUserDeleteSshUser({
      sshUserId,
    });

    assertSuccess(response);
  }
}
