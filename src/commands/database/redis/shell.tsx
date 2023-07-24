import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { ReactNode } from "react";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import * as cp from "child_process";
import { Text } from "ink";
import { getConnectionDetails } from "../../../lib/database/redis/connect.js";
import { redisArgs, withRedisId } from "../../../lib/database/redis/flags.js";

export class Shell extends ExecRenderBaseCommand<
  typeof Shell,
  Record<string, never>
> {
  static summary = "Connect to a Redis database via the redis-cli";
  static flags = {
    ...processFlags,
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
      p,
    );

    p.complete(<Text>Starting Redis shell -- get ready...</Text>);

    const sshArgs = ["-t", "-l", sshUser, sshHost, "redis-cli", "-h", hostname];

    cp.spawnSync("ssh", sshArgs, { stdio: "inherit" });
    return {};
  }

  protected render(): ReactNode {
    return undefined;
  }
}
