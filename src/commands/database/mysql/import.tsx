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
  mysqlConnectionFlagsWithTempUser,
  withMySQLId,
} from "../../../lib/database/mysql/flags.js";
import { getConnectionDetailsWithPasswordOrTemporaryUser } from "../../../lib/database/mysql/connect.js";
import { executeViaSSH, RunCommand } from "../../../lib/ssh/exec.js";
import { sshConnectionFlags } from "../../../lib/ssh/flags.js";
import shellEscape from "shell-escape";

export class Import extends ExecRenderBaseCommand<
  typeof Import,
  Record<string, never>
> {
  static summary = "Imports a dump of a MySQL database";
  static flags = {
    ...processFlags,
    ...mysqlConnectionFlagsWithTempUser,
    ...sshConnectionFlags,
    input: Flags.string({
      char: "i",
      summary: 'the input file from which to read the dump ("-" for stdin)',
      description:
        'The input file from which to read the dump to. You can specify "-" or "/dev/stdin" to read the dump directly from STDIN.',
      required: true,
    }),
    gzip: Flags.boolean({
      summary: "uncompress the dump with gzip",
      aliases: ["gz"],
      description:
        "Uncompress the dump with gzip while importing. This is useful for large databases, as it can significantly reduce the size of the dump.",
      default: false,
      required: false,
    }),
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = await withMySQLId(this.apiClient, this.flags, this.args);
    const p = makeProcessRenderer(this.flags, "Importing a MySQL database");

    const connectionDetails =
      await getConnectionDetailsWithPasswordOrTemporaryUser(
        this.apiClient,
        databaseId,
        p,
        this.flags,
      );

    const { project } = connectionDetails;
    const mysqlArgs = buildMySqlArgs(connectionDetails);

    let cmd: RunCommand = { command: "mysql", args: mysqlArgs };
    if (this.flags.gzip) {
      const escapedArgs = shellEscape(mysqlArgs);
      cmd = {
        shell: `set -e -o pipefail > /dev/null ; gunzip | mysql ${escapedArgs}`,
      };
    }

    await p.runStep(
      <Text>
        starting mysql via SSH on project <Value>{project.shortId}</Value>
      </Text>,
      () =>
        executeViaSSH(
          this.apiClient,
          this.flags["ssh-user"],
          { projectId: connectionDetails.project.id },
          cmd,
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
