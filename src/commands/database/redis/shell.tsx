import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import * as cp from "child_process";
import { Text } from "ink";
import { getConnectionDetails } from "../../../lib/resources/database/redis/connect.js";
import {
  redisArgs,
  withRedisId,
} from "../../../lib/resources/database/redis/flags.js";
import { sshUsageDocumentation } from "../../../lib/resources/ssh/doc.js";
import { sshConnectionFlags } from "../../../lib/resources/ssh/flags.js";
import { buildSSHClientFlags } from "../../../lib/resources/ssh/connection.js";

export class Shell extends ExecRenderBaseCommand<
  typeof Shell,
  Record<string, never>
> {
  static summary = "Connect to a Redis database via the redis-cli";
  static description =
    "This command opens an interactive redis-cli shell to a Redis database.\n\n" +
    sshUsageDocumentation;
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
  };
  static args = { ...redisArgs };

  protected async exec(): Promise<Record<string, never>> {
    const databaseId = await withRedisId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    const p = makeProcessRenderer(this.flags, "Starting a Redis shell");

    const { sshUser, sshHost, hostname } = await getConnectionDetails(
      this.apiClient,
      databaseId,
      this.flags["ssh-user"],
      p,
    );

    await p.complete(<Text>Starting Redis shell -- get ready...</Text>);

    const sshArgs = buildSSHClientFlags(sshUser, sshHost, this.flags, {
      interactive: true,
      configDir: this.config.configDir,
    });
    const redisArgs = ["-h", hostname];

    cp.spawnSync("ssh", [...sshArgs, "redis-cli", ...redisArgs], {
      stdio: "inherit",
    });
    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
