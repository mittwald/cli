import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import * as cp from "child_process";
import { Text } from "ink";
import {
  mysqlArgs,
  mysqlConnectionFlags,
  withMySQLId,
} from "../../../lib/resources/database/mysql/flags.js";
import { getConnectionDetailsWithPassword } from "../../../lib/resources/database/mysql/connect.js";
import { sshUsageDocumentation } from "../../../lib/resources/ssh/doc.js";
import { sshConnectionFlags } from "../../../lib/resources/ssh/flags.js";
import { buildSSHClientFlags } from "../../../lib/resources/ssh/connection.js";

export class Shell extends ExecRenderBaseCommand<
  typeof Shell,
  Record<string, never>
> {
  static summary = "Connect to a MySQL database via the MySQL shell";
  static description =
    "This command opens an interactive mysql shell to a MySQL database.\n\n" +
    sshUsageDocumentation;
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
    ...mysqlConnectionFlags,
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = await withMySQLId(this.apiClient, this.flags, this.args);
    const p = makeProcessRenderer(this.flags, "Starting a MySQL shell");

    const { sshUser, sshHost, user, hostname, database, password } =
      await getConnectionDetailsWithPassword(
        this.apiClient,
        databaseId,
        p,
        this.flags,
      );

    await p.complete(<Text>Starting MySQL shell -- get ready...</Text>);

    const sshArgs = buildSSHClientFlags(sshUser, sshHost, this.flags, {
      interactive: true,
      configDir: this.config.configDir,
    });
    const mysqlArgs = ["-h", hostname, "-u", user, "-p" + password, database];

    cp.spawnSync("ssh", [...sshArgs, "mysql", ...mysqlArgs], {
      stdio: "inherit",
    });
    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
