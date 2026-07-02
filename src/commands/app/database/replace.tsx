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
import { adminUserIdFlag } from "../../../lib/resources/app/database/flags.js";

export default class Replace extends ExecRenderBaseCommand<
  typeof Replace,
  void
> {
  static summary = "Replace the database linked to an app installation.";
  static description =
    "Replaces a database that is currently linked to an app installation with another one, keeping the same purpose.";

  static examples = [
    {
      description: "Replace the linked database of an app installation",
      command:
        "<%= config.bin %> <%= command.id %> a-XXXXXX --old-database-id d-OLDXXX --new-database-id d-NEWXXX --admin-user-id dbu-XXXXXX",
    },
  ];

  static args = {
    ...appInstallationArgs,
  };

  static flags = {
    ...processFlags,
    "old-database-id": Flags.string({
      summary: "the ID of the database that is currently linked.",
      description:
        "The ID (UUID) of the database that is currently linked to the app installation and should be replaced.",
      required: true,
    }),
    "new-database-id": Flags.string({
      summary: "the ID of the database to link instead.",
      description:
        "The ID (UUID) of the database that should replace the currently linked database.",
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
      "old-database-id": oldDatabaseId,
      "new-database-id": newDatabaseId,
      "admin-user-id": adminUserId,
    } = this.flags;

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
