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
import assertSuccess from "../../../lib/assert_success.js";

export class Import extends ExecRenderBaseCommand<
  typeof Import,
  Record<string, never>
> {
  static summary = "Imports a dump of a MySQL database";
  static flags = {
    ...processFlags,
    ...mysqlConnectionFlags,
    "temporary-user": Flags.boolean({
      summary: "create a temporary user for the dump",
      description:
        "Create a temporary user for the dump. This user will be deleted after the dump has been imported. This is useful if you want to import a dump into a database that is not accessible from the outside.\n\nIf this flag is disabled, you will need to specify the password of the default user; either via the --mysql-password flag or via the MYSQL_PWD environment variable.",
      default: true,
      required: false,
      allowNo: true,
    }),
    input: Flags.string({
      char: "i",
      summary: 'the input file from which to read the dump ("-" for stdin)',
      description:
        'The input file from which to read the dump to. You can specify "-" or "/dev/stdin" to read the dump directly from STDIN.',
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
    const p = makeProcessRenderer(this.flags, "Importing a MySQL database");

    const connectionDetails = await getConnectionDetailsWithPassword(
      this.apiClient,
      databaseId,
      p,
      this.flags,
    );

    if (this.flags["temporary-user"]) {
      const [tempUser, tempPassword] = await p.runStep(
        "creating a temporary database user",
        () => this.createTemporaryUser(databaseId),
      );

      p.addCleanup("removing temporary database user", async () => {
        const r = await this.apiClient.database.deleteMysqlUser({
          mysqlUserId: tempUser.id,
        });
        assertSuccess(r);
      });

      connectionDetails.user = tempUser.name;
      connectionDetails.password = tempPassword;
    }

    const { project } = connectionDetails;
    const mysqlArgs = buildMySqlArgs(connectionDetails);

    await p.runStep(
      <Text>
        starting mysql via SSH on project <Value>{project.shortId}</Value>
      </Text>,
      () =>
        executeViaSSH(
          this.apiClient,
          { projectId: connectionDetails.project.id },
          { command: "mysql", args: mysqlArgs },
          null,
          this.getInputStream(),
        ),
    );

    await p.complete(
      <ImportSuccess
        database={connectionDetails.database}
        input={this.flags.input}
      />,
    );

    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }

  private getInputStream(): NodeJS.ReadableStream {
    if (this.flags.input === "-") {
      return process.stdin;
    }

    return fs.createReadStream(this.flags.input);
  }

  private async createTemporaryUser(
    databaseId: string,
  ): Promise<[{ id: string; name: string }, string]> {
    const password = randomBytes(32).toString("base64");
    const createResponse = await this.apiClient.database.createMysqlUser({
      mysqlDatabaseId: databaseId,
      data: {
        accessLevel: "full", // needed for "PROCESS" privilege
        externalAccess: false,
        password,
        databaseId,
        description: "Temporary user for exporting database",
      },
    });

    assertStatus(createResponse, 201);

    const userResponse = await this.apiClient.database.getMysqlUser({
      mysqlUserId: createResponse.data.id,
    });
    assertStatus(userResponse, 200);

    return [userResponse.data, password];
  }
}

function ImportSuccess({
  database,
  input,
}: {
  database: string;
  input: string;
}) {
  return (
    <Success>
      Dump of MySQL database <Value>{database}</Value> successfully imported{" "}
      from <Value>{input}</Value>
    </Success>
  );
}

function buildMySqlArgs(d: {
  hostname: string;
  user: string;
  password: string;
  database: string;
}): string[] {
  return ["-h", d.hostname, "-u", d.user, "-p" + d.password, d.database];
}
