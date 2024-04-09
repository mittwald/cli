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
import { runWithConnectionDetails } from "../../../lib/database/mysql/connect.js";
import { executeViaSSH, RunCommand } from "../../../lib/ssh/exec.js";
import shellEscape from "shell-escape";
import { sshConnectionFlags } from "../../../lib/ssh/flags.js";

export class Dump extends ExecRenderBaseCommand<
  typeof Dump,
  Record<string, never>
> {
  static summary = "Create a dump of a MySQL database";
  static flags = {
    ...processFlags,
    ...mysqlConnectionFlagsWithTempUser,
    ...sshConnectionFlags,
    output: Flags.string({
      char: "o",
      summary: 'the output file to write the dump to ("-" for stdout)',
      description:
        'The output file to write the dump to. You can specify "-" or "/dev/stdout" to write the dump directly to STDOUT; in this case, you might want to use the --quiet/-q flag to supress all other output, so that you can pipe the mysqldump for further processing.',
      required: true,
    }),
    gzip: Flags.boolean({
      summary: "compress the dump with gzip",
      aliases: ["gz"],
      description:
        "Compress the dump with gzip. This is useful for large databases, as it can significantly reduce the size of the dump.",
      default: false,
      required: false,
    }),
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = await withMySQLId(this.apiClient, this.flags, this.args);
    const p = makeProcessRenderer(this.flags, "Dumping a MySQL database");

    const databaseName = await runWithConnectionDetails(
      this.apiClient,
      databaseId,
      p,
      this.flags,
      async (connectionDetails) => {
        const { project } = connectionDetails;
        const mysqldumpArgs = buildMySqlDumpArgs(connectionDetails);

        let cmd: RunCommand = { command: "mysqldump", args: mysqldumpArgs };
        if (this.flags.gzip) {
          const escapedArgs = shellEscape(mysqldumpArgs);
          cmd = {
            shell: `set -e -o pipefail > /dev/null ; mysqldump ${escapedArgs} | gzip`,
          };
        }

        await p.runStep(
          <Text>
            starting mysqldump via SSH on project{" "}
            <Value>{project.shortId}</Value>
          </Text>,
          () =>
            executeViaSSH(
              this.apiClient,
              this.flags["ssh-user"],
              { projectId: connectionDetails.project.id },
              cmd,
              { input: null, output: this.getOutputStream() },
            ),
        );

        return connectionDetails.database;
      },
    );

    await p.complete(
      <DumpSuccess database={databaseName} output={this.flags.output} />,
    );

    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }

  private getOutputStream(): NodeJS.WritableStream {
    if (this.flags.output === "-") {
      return process.stdout;
    }

    return fs.createWriteStream(this.flags.output);
  }
}

function DumpSuccess({
  database,
  output,
}: {
  database: string;
  output: string;
}) {
  return (
    <Success>
      Dump of MySQL database <Value>{database}</Value> written to{" "}
      <Value>{output}</Value>
    </Success>
  );
}

function buildMySqlDumpArgs(d: {
  hostname: string;
  user: string;
  password: string;
  database: string;
}): string[] {
  return ["-h", d.hostname, "-u", d.user, `-p${d.password}`, d.database];
}
