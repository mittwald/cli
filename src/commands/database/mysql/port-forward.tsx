import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import * as cp from "child_process";
import { Text } from "ink";
import { mysqlArgs, withMySQLId } from "../../../lib/database/mysql/flags.js";
import { getConnectionDetails } from "../../../lib/database/mysql/connect.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { Flags } from "@oclif/core";

export class PortForward extends ExecRenderBaseCommand<
  typeof PortForward,
  Record<string, never>
> {
  static summary = "Forward the TCP port of a MySQL database to a local port";
  static flags = {
    ...processFlags,
    port: Flags.integer({
      summary: "The local TCP port to forward to",
      default: 3306,
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
    const p = makeProcessRenderer(
      this.flags,
      "Port-forwarding a MySQL database",
    );

    const { sshUser, sshHost, hostname, database } = await getConnectionDetails(
      this.apiClient,
      databaseId,
      p,
    );

    const { port } = this.flags;

    p.complete(
      <Text>
        Forwarding MySQL database <Value>{database}</Value> to local port{" "}
        <Value>{port}</Value>. Use CTRL+C to cancel.
      </Text>,
    );

    const sshArgs = [
      "-T",
      "-L",
      `${port}:${hostname}:3306`,
      "-l",
      sshUser,
      sshHost,
      "cat",
      "/dev/zero",
    ];

    cp.spawnSync("ssh", sshArgs, {
      stdio: ["ignore", process.stdout, process.stderr],
    });
    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
