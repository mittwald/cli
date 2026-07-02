import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import assertSuccess from "../../../lib/apiutil/assert_success.js";
import { appInstallationArgs } from "../../../lib/resources/app/flags.js";
import { getAppInstallationFromUuid } from "../../../lib/resources/app/uuid.js";
import {
  adminUserIdFlag,
  databasePurposeSelectorFlag,
} from "../../../lib/resources/app/database/flags.js";
import {
  resolveDatabaseId,
  selectLinkedDatabase,
} from "../../../lib/resources/app/database/lookup.js";

export default class Replace extends ExecRenderBaseCommand<
  typeof Replace,
  void
> {
  static summary = "Replace the database linked to an app installation.";
  static description =
    "Replaces the database that is currently linked to an app installation with another one, keeping the same purpose. The currently linked database is determined automatically.";

  static examples = [
    {
      description: "Replace the linked database of an app installation",
      command:
        "<%= config.bin %> <%= command.id %> a-XXXXXX --new-database-id my-new-database --admin-user-id dbu-XXXXXX",
    },
  ];

  static args = {
    ...appInstallationArgs,
  };

  static flags = {
    ...processFlags,
    purpose: databasePurposeSelectorFlag,
    "new-database-id": Flags.string({
      summary: "the ID or name of the database to link instead.",
      description:
        "The ID (UUID) or name of the database that should replace the currently linked database. When a name is given, it is resolved against the databases of the app installation's project.",
      required: true,
    }),
    "admin-user-id": adminUserIdFlag,
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags,
      "Replacing linked database of app installation",
    );

    const appInstallationId = await this.withAppInstallationId(Replace);
    const {
      "new-database-id": newDatabaseIdentifier,
      "admin-user-id": adminUserId,
      purpose,
    } = this.flags;

    const { oldDatabaseId, newDatabaseId } = await process.runStep(
      "resolving databases",
      async () => {
        const appInstallation = await getAppInstallationFromUuid(
          this.apiClient,
          appInstallationId,
        );
        const linkedDatabase = selectLinkedDatabase(
          appInstallation.linkedDatabases,
          purpose,
        );
        const resolvedNewDatabaseId = await resolveDatabaseId(
          this.apiClient,
          appInstallation.projectId,
          newDatabaseIdentifier,
        );
        return {
          oldDatabaseId: linkedDatabase.databaseId,
          newDatabaseId: resolvedNewDatabaseId,
        };
      },
    );

    await process.runStep("replacing database", async () => {
      const response = await this.apiClient.app.replaceDatabase({
        appInstallationId,
        data: {
          oldDatabaseId,
          newDatabaseId,
          databaseUserIds: {
            admin: adminUserId,
          },
        },
      });
      assertSuccess(response);
    });

    await process.complete(
      <Success>The linked database was successfully replaced.</Success>,
    );
  }

  protected render(): ReactNode {
    return null;
  }
}
