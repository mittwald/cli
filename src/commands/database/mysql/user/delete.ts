import { Args } from "@oclif/core";
import { DeleteBaseCommand } from "../../../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../../../lib/apiutil/assert_success.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a MySQL user";
  static resourceName = "MySQL user";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "user-id": Args.string({
      description: "ID of the MySQL user to delete.",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const mysqlUserId = this.args["user-id"];
    const response = await this.apiClient.database.deleteMysqlUser({
      mysqlUserId,
    });

    assertSuccess(response);
  }
}
