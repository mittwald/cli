import { normalizeProjectId } from "../../../normalize_id.js";
import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";
import { mysqlArgs, withMySQLId } from "../../../lib/database/mysql/flags.js";
import assertSuccess from "../../../lib/assert_success.js";

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
      this.config,
    );
    const response = await this.apiClient.database.deleteMysqlDatabase({
      mysqlDatabaseId,
    });

    assertSuccess(response);
  }

  protected mapResourceId(id: string): Promise<string> {
    return normalizeProjectId(this.apiClient, id);
  }
}
