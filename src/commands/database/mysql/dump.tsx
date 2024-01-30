import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";
import * as fs from "fs";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  mysqlArgs,
  mysqlConnectionFlags,
  withMySQLId,
} from "../../../lib/database/mysql/flags.js";
import { getConnectionDetailsWithPassword } from "../../../lib/database/mysql/connect.js";
import { assertStatus } from "@mittwald/api-client";
import { randomBytes } from "crypto";
import { executeViaSSH } from "../../../lib/ssh/exec.js";

export class Dump extends ExecRenderBaseCommand<
  typeof Dump,
  Record<string, never>
> {
  static summary = "Create a dump of a MySQL database";
  static flags = {
    ...processFlags,
    ...mysqlConnectionFlags,
    "temporary-user": Flags.boolean({
      summary: "create a temporary user for the dump",
      description:
        "Create a temporary user for the dump. This user will be deleted after the dump has been created. This is useful if you want to dump a database that is not accessible from the outside.\n\nIf this flag is disabled, you will need to specify the password of the default user; either via the --mysql-password flag or via the MYSQL_PWD environment variable.",
      default: true,
      required: false,
      allowNo: true,
    }),
    output: Flags.string({
      char: "o",
      summary: 'the output file to write the dump to ("-" for stdout)',
      description:
        'The output file to write the dump to. You can specify "-" or "/dev/stdout" to write the dump directly to STDOUT; in this case, you might want to use the --quiet/-q flag to supress all other output, so that you can pipe the mysqldump for further processing.',
      required: true,
    }),
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = await withMySQLId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    const p = makeProcessRenderer(this.flags, "Dumping a MySQL database");

    const connectionDetails = await getConnectionDetailsWithPassword(
      this.apiClient,
      databaseId,
      p,
      this.flags,
    );

    let cleanup: () => Promise<void> = async () => {};

    if (this.flags["temporary-user"]) {
      const tempPassword = randomBytes(32).toString("base64");
      const tempUser = await p.runStep(
        "creating a temporary database user",
        async () => {
          const createResponse = await this.apiClient.database.createMysqlUser({
            mysqlDatabaseId: databaseId,
            data: {
              accessLevel: "full", // needed for "PROCESS" privilege
              externalAccess: false,
              password: tempPassword,
              databaseId,
              description: "Temporary user for exporting database",
            },
          });

          assertStatus(createResponse, 201);

          const userResponse = await this.apiClient.database.getMysqlUser({
            mysqlUserId: createResponse.data.id,
          });
          assertStatus(userResponse, 200);

          return userResponse.data;
        },
      );

      cleanup = async () => {
        await p.runStep("deleting temporary user", async () => {
          const r = await this.apiClient.database.deleteMysqlUser({
            mysqlUserId: tempUser.id,
          });
          assertStatus(r, 204);
        });
      };

      connectionDetails.user = tempUser.name;
      connectionDetails.password = tempPassword;
    }

    const { user, hostname, database, password, project } = connectionDetails;

    const mysqldumpArgs = [
      "-h",
      hostname,
      "-u",
      user,
      "-p" + password,
      database,
    ];

    const stream = fs.createWriteStream(this.flags.output);
    await p.runStep(
      <Text>
        starting mysqldump via SSH on project <Value>{project.shortId}</Value>
      </Text>,
      async () => {
        await executeViaSSH(
          this.apiClient,
          { projectId: connectionDetails.project.id },
          "mysqldump",
          mysqldumpArgs,
          stream,
        );
      },
    );

    await cleanup();

    p.complete(
      <Success>
        Dump of MySQL database <Value>{database}</Value> written to{" "}
        <Value>{this.flags.output}</Value>
      </Success>,
    );

    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
