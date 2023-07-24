import { BaseCommand } from "../../../BaseCommand.js";
import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import open from "open";

export class PhpMyAdmin extends BaseCommand {
  static summary = "Open phpMyAdmin for a MySQL database.";

  static args = {
    "database-id": Args.string({
      description: "ID of the MySQL database to open phpMyAdmin for.",
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(PhpMyAdmin);
    const users = await this.apiClient.database.listMysqlUsers({
      pathParameters: { databaseId: args["database-id"] },
    });

    assertStatus(users, 200);

    const mainUser = users.data.find((u) => u.mainUser);
    if (!mainUser) {
      throw new Error("no main user found.");
    }

    const pma = await this.apiClient.database.getMysqlUserPhpMyAdminUrl({
      pathParameters: { id: mainUser.id },
    });

    assertStatus(pma, 200);

    await open(pma.data.url);
  }
}
