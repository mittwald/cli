import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";
import { appInstallationArgs } from "../../../lib/resources/app/flags.js";
import { getAppInstallationFromUuid } from "../../../lib/resources/app/uuid.js";
import { databasePurposeSelectorFlag } from "../../../lib/resources/app/database/flags.js";
import { selectLinkedDatabase } from "../../../lib/resources/app/database/lookup.js";

export default class Unlink extends DeleteBaseCommand<typeof Unlink> {
  static summary = "Unlink a database from an app installation.";
  static description =
    "Removes the linkage between an app installation and its database. The currently linked database is determined automatically; the database itself is not deleted.";
  static resourceName = "database link";

  static examples = [
    {
      description: "Unlink the database from an app installation",
      command: "<%= config.bin %> <%= command.id %> a-XXXXXX",
    },
  ];

  static args = {
    ...appInstallationArgs,
  };

  static flags = {
    ...DeleteBaseCommand.baseFlags,
    purpose: databasePurposeSelectorFlag,
  };

  protected async deleteResource(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Unlink);
    const appInstallation = await getAppInstallationFromUuid(
      this.apiClient,
      appInstallationId,
    );
    const linkedDatabase = selectLinkedDatabase(
      appInstallation.linkedDatabases,
      this.flags.purpose,
    );

    const response = await this.apiClient.app.unlinkDatabase({
      appInstallationId,
      databaseId: linkedDatabase.databaseId,
    });

    assertSuccess(response);
  }
}
