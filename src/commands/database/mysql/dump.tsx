import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import * as cp from "child_process";
import { Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";
import * as fs from "fs";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  mysqlArgs,
  mysqlConnectionFlags,
} from "../../../lib/database/mysql/flags.js";
import { getConnectionDetailsWithPassword } from "../../../lib/database/mysql/connect.js";

export class Dump extends ExecRenderBaseCommand<
  typeof Dump,
  Record<string, never>
> {
  static summary = "Create a dump of a MySQL database";
  static flags = {
    ...processFlags,
    ...mysqlConnectionFlags,
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
    const databaseId = this.args["database-id"];
    const p = makeProcessRenderer(this.flags, "Dumping a MySQL database");

    const { sshUser, sshHost, user, hostname, database, password } =
      await getConnectionDetailsWithPassword(
        this.apiClient,
        databaseId,
        p,
        this.flags,
      );

    const sshArgs = [
      "-l",
      sshUser,
      "-T",
      sshHost,
      "mysqldump",
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
        starting mysqldump via SSH on <Value>{sshHost}</Value> as{" "}
        <Value>{sshUser}</Value>
      </Text>,
      () => {
        const ssh = cp.spawn("ssh", sshArgs, {
          stdio: ["ignore", "pipe", "pipe"],
        });

        let err = "";

        ssh.stdout.pipe(stream);
        ssh.stderr.on("data", (data) => {
          err += data.toString();
        });

        return new Promise((res, rej) => {
          ssh.on("exit", (code) => {
            stream.close();
            if (code === 0) {
              res(undefined);
            } else {
              rej(new Error(`ssh+mysqldump exited with code ${code}\n${err}`));
            }
          });
        });
      },
    );

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
