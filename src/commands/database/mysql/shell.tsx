import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import * as cp from "child_process";
import { Text } from "ink";
import {
  mysqlArgs,
  mysqlConnectionFlags,
} from "../../../lib/database/mysql/flags.js";
import { getConnectionDetailsWithPassword } from "../../../lib/database/mysql/connect.js";

export class Shell extends ExecRenderBaseCommand<
  typeof Shell,
  Record<string, never>
> {
  static summary = "Connect to a MySQL database via the MySQL shell";
  static flags = {
    ...processFlags,
    ...mysqlConnectionFlags,
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = this.args["database-id"];
    const p = makeProcessRenderer(this.flags, "Starting a MySQL shell");

    const { sshUser, sshHost, user, hostname, database, password } =
      await getConnectionDetailsWithPassword(
        this.apiClient,
        databaseId,
        p,
        this.flags,
      );

    p.complete(<Text>Starting MySQL shell -- get ready...</Text>);

    const sshArgs = [
      "-t",
      "-l",
      sshUser,
      sshHost,
      "mysql",
      "-h",
      hostname,
      "-u",
      user,
      "-p" + password,
      database,
    ];

    cp.spawnSync("ssh", sshArgs, { stdio: "inherit" });
    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
