import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Flags } from "@oclif/core";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { Text } from "ink";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";

type Result = {
  databaseId: string;
  userId: string;
};

export class Create extends ExecRenderBaseCommand<typeof Create, Result> {
  static summary = "Create a new MySQL database";
  static flags = {
    ...projectFlags,
    ...processFlags,
    description: Flags.string({
      char: "d",
      summary: "a description for the database",
      required: true,
    }),
    version: Flags.string({
      summary: "the MySQL version to use",
      description:
        'Use the "database mysql versions" command to list available versions',
      required: true,
    }),
    collation: Flags.string({
      summary: "the collation to use",
      default: "utf8mb4_unicode_ci",
    }),
    "character-set": Flags.string({
      summary: "the character set to use",
      default: "utf8mb4",
    }),
    "user-password": Flags.string({
      summary: "the password to use for the default user (env: MYSQL_PWD)",
      env: "MYSQL_PWD",
    }),
    "user-external": Flags.boolean({
      summary: "enable external access for default user",
      default: false,
    }),
    "user-access-level": Flags.string({
      summary: "the access level preset for the default user",
      options: ["full", "readonly"],
      default: "full",
    }),
  };

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Creating a new MySQL database");
    const projectId = await withProjectId(
      this.apiClient,
      Create,
      this.flags,
      this.args,
      this.config,
    );

    const {
      description,
      version,
      collation,
      "character-set": characterSet,
      "user-external": externalAccess,
      "user-access-level": accessLevel,
    } = this.flags;

    const password = await this.getPassword(p);

    const db = await p.runStep("creating MySQL database", async () => {
      const r = await this.apiClient.database.createMysqlDatabase({
        projectId,
        data: {
          database: {
            projectId,
            description,
            version,
            characterSettings: {
              collation,
              characterSet,
            },
          },
          user: {
            password,
            externalAccess,
            accessLevel: accessLevel as "full" | "readonly",
          },
        },
      });

      assertStatus(r, 201);
      return r.data;
    });

    const database = await p.runStep("fetching database", async () => {
      const r = await this.apiClient.database.getMysqlDatabase({
        mysqlDatabaseId: db.id,
      });
      assertStatus(r, 200);

      return r.data;
    });

    const user = await p.runStep("fetching user", async () => {
      const r = await this.apiClient.database.getMysqlUser({
        mysqlUserId: db.userId,
      });
      assertStatus(r, 200);

      return r.data;
    });

    p.complete(
      <Success>
        The database <Value>{database.name}</Value> and the user{" "}
        <Value>{user.name}</Value> were successfully created.
      </Success>,
    );

    return { databaseId: db.id, userId: db.userId };
  }

  private async getPassword(p: ProcessRenderer): Promise<string> {
    if (this.flags["user-password"]) {
      return this.flags["user-password"];
    }

    return await p.addInput(<Text>enter password for default user</Text>, true);
  }

  protected render({ databaseId }: Result): ReactNode {
    if (this.flags.quiet) {
      return databaseId;
    }
  }
}
