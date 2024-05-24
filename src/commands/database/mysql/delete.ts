import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import {
  mysqlArgs,
  withMySQLId,
} from "../../../lib/resources/database/mysql/flags.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a MySQL database";
  static resourceName = "MySQL database";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...mysqlArgs };

  protected async deleteResource(): Promise<void> {
    const mysqlDatabaseId = await withMySQLId(
      this.apiClient,
      this.flags,
      this.args,
    );
    const response = await this.apiClient.database.deleteMysqlDatabase({
      mysqlDatabaseId,
    });

    assertSuccess(response);
  }
}
