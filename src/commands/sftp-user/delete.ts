import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import assertSuccess from "../../lib/assert_success.js";
import { Args } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete an SFTP user";
  static resourceName = "SFTP user";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "sftp-user-id": Args.string({
      description: "The ID of the SFTP user to delete",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const sftpUserId = this.args["sftp-user-id"];
    const response = await this.apiClient.sshsftpUser.sftpUserDeleteSftpUser({
      sftpUserId,
    });

    assertSuccess(response);
  }
}
