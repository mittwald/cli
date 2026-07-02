import { Flags } from "@oclif/core";
import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";
import { appInstallationArgs } from "../../../lib/resources/app/flags.js";

export default class Unlink extends DeleteBaseCommand<typeof Unlink> {
  static summary = "Unlink a database from an app installation.";
  static description =
    "Removes the linkage between an app installation and a database. The database itself is not deleted.";
  static resourceName = "database link";

  static examples = [
    {
      description: "Unlink a database from an app installation",
      command:
        "<%= config.bin %> <%= command.id %> a-XXXXXX --database-id d-XXXXXX",
    },
  ];

  static args = {
    ...appInstallationArgs,
  };

  static flags = {
    ...DeleteBaseCommand.baseFlags,
    "database-id": Flags.string({
      summary: "the ID of the database to unlink from the app installation.",
      description:
        "The ID (UUID) of the database that should be unlinked from the app installation.",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Unlink);
    const response = await this.apiClient.app.unlinkDatabase({
      appInstallationId,
      databaseId: this.flags["database-id"],
    });

    assertSuccess(response);
  }
}
