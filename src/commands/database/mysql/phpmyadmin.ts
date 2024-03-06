import { BaseCommand } from "../../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import open from "open";
import { mysqlArgs, withMySQLId } from "../../../lib/database/mysql/flags.js";

export class PhpMyAdmin extends BaseCommand {
  static summary = "Open phpMyAdmin for a MySQL database.";

  static args = { ...mysqlArgs };

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(PhpMyAdmin);
    const databaseId = await withMySQLId(this.apiClient, flags, args);
    const users = await this.apiClient.database.listMysqlUsers({
      mysqlDatabaseId: databaseId,
    });

    assertStatus(users, 200);

    const mainUser = users.data.find((u) => u.mainUser);
    if (!mainUser) {
      throw new Error("no main user found.");
    }

    const pma = await this.apiClient.database.getMysqlUserPhpMyAdminUrl({
      mysqlUserId: mainUser.id,
    });

    assertStatus(pma, 200);

    await open(pma.data.url);
  }
}
