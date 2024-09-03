import { Args } from "@oclif/core";
import { DeleteBaseCommand } from "../../../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../../../lib/apiutil/assert_success.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a MySQL user";
  static resourceName = "MySQL user";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "user-id": Args.string({
      required: true,
      description: "ID of the MySQL user to delete.",
    }),
  };

  protected async deleteResource(): Promise<void> {
    const mysqlUserId = this.args["user-id"];
    const currentMysqlUserData = await this.apiClient.database.getMysqlUser({
      mysqlUserId,
    });
    assertSuccess(currentMysqlUserData);
    if (currentMysqlUserData.data.mainUser) {
      throw new Error(
        "The main MySQL user can not be deleted manually. It's deleted only if its database is deleted.",
      );
    } else {
      const response = await this.apiClient.database.deleteMysqlUser({
        mysqlUserId,
      });
      assertSuccess(response);
    }
  }
}
