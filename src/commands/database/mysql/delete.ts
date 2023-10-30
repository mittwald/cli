import { assertStatus } from "@mittwald/api-client-commons";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";
import { mysqlArgs, withMySQLId } from "../../../lib/database/mysql/flags.js";

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

    assertStatus(response, 200);
  }

  protected mapResourceId(id: string): Promise<string> {
    return normalizeProjectIdToUuid(this.apiClient, id);
  }
}
