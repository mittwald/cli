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
import {
  adminUserIdFlag,
  databasePurposeFlag,
} from "../../../lib/resources/app/database/flags.js";

export default class Link extends ExecRenderBaseCommand<typeof Link, void> {
  static summary = "Link a database to an app installation.";
  static description =
    "Creates a linkage between an app installation and an existing database, so the app can use it for the given purpose.";

  static examples = [
    {
      description: "Link a database as the primary database of an app",
      command:
        "<%= config.bin %> <%= command.id %> a-XXXXXX --database-id d-XXXXXX --admin-user-id dbu-XXXXXX",
    },
  ];

  static args = {
    ...appInstallationArgs,
  };

  static flags = {
    ...processFlags,
    "database-id": Flags.string({
      summary: "the ID of the database to link to the app installation.",
      description:
        "The ID (UUID) of an existing database that should be linked to the app installation.",
      required: true,
    }),
    purpose: databasePurposeFlag,
    "admin-user-id": adminUserIdFlag,
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags,
      "Linking database to app installation",
    );

    const appInstallationId = await this.withAppInstallationId(Link);
    const {
      "database-id": databaseId,
      purpose,
      "admin-user-id": adminUserId,
    } = this.flags;

    await process.runStep("linking database", async () => {
      const response = await this.apiClient.app.linkDatabase({
        appInstallationId,
        data: {
          databaseId,
          purpose: purpose as "primary" | "cache" | "custom",
          databaseUserIds: {
            admin: adminUserId,
          },
        },
      });
      assertSuccess(response);
    });

    await process.complete(
      <Success>The database was successfully linked to the app.</Success>,
    );
  }

  protected render(): ReactNode {
    return null;
  }
}
