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
  withMySQLId,
} from "../../../lib/resources/database/mysql/flags.js";
import { getConnectionDetails } from "../../../lib/resources/database/mysql/connect.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { Flags } from "@oclif/core";
import { sshConnectionFlags } from "../../../lib/resources/ssh/flags.js";
import { sshUsageDocumentation } from "../../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../../lib/resources/ssh/connection.js";

export class PortForward extends ExecRenderBaseCommand<
  typeof PortForward,
  Record<string, never>
> {
  static summary = "Forward the TCP port of a MySQL database to a local port";
  static description =
    "This command forwards the TCP port of a MySQL database to a local port on your machine. This allows you to connect to the database as if it were running on your local machine.\n\n" +
    sshUsageDocumentation;
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
    port: Flags.integer({
      summary: "The local TCP port to forward to",
      default: 3306,
    }),
  };
  static args = { ...mysqlArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = await withMySQLId(this.apiClient, this.flags, this.args);
    const p = makeProcessRenderer(
      this.flags,
      "Port-forwarding a MySQL database",
    );

    const { sshUser, sshHost, hostname, database } = await getConnectionDetails(
      this.apiClient,
      databaseId,
      this.flags["ssh-user"],
      undefined,
      p,
    );

    const { port } = this.flags;

    p.complete(
      <Text>
        Forwarding MySQL database <Value>{database}</Value> to local port{" "}
        <Value>{port}</Value>. Use CTRL+C to cancel.
      </Text>,
    );

    const sshArgs = buildSSHClientFlags(sshUser, sshHost, this.flags, {
      interactive: false,
      additionalFlags: ["-L", `${port}:${hostname}:3306`],
    });

    cp.spawnSync("ssh", [...sshArgs, "sleep", "infinity"], {
      stdio: ["ignore", process.stdout, process.stderr],
    });
    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
