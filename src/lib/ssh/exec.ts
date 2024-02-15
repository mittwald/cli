import cp, { ChildProcessByStdio } from "child_process";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { SSHConnectionData } from "./types.js";
import { getSSHConnectionForAppInstallation } from "./appinstall.js";
import { getSSHConnectionForProject } from "./project.js";
import { Readable, Writable } from "stream";

export type RunTarget = { appInstallationId: string } | { projectId: string };

export async function executeViaSSH(
  client: MittwaldAPIV2Client,
  target: RunTarget,
  command: string,
  args: string[],
  output: NodeJS.WritableStream | null,
  input: NodeJS.ReadableStream | null = null,
): Promise<void> {
  const { user, host } = await connectionDataForTarget(client, target);
  const sshArgs = ["-l", user, "-T", host, command, ...args];
  const ssh = cp.spawn("ssh", sshArgs, {
    stdio: [input ? "pipe" : "ignore", output ? "pipe" : "ignore", "pipe"],
  }) as ChildProcessByStdio<Writable | null, Readable | null, Readable>;

  let err = "";

  if (input && ssh.stdin) {
    input.pipe(ssh.stdin);
  }

  if (output && ssh.stdout) {
    ssh.stdout.pipe(output);
  }

  ssh.stderr.on("data", (data) => {
    err += data.toString();
  });

  await new Promise((res, rej) => {
    ssh.on("exit", (code) => {
      const resolve = () => {
        if (code === 0) {
          res(undefined);
        } else {
          rej(new Error(`ssh+${command} exited with code ${code}\n${err}`));
        }
      };

      if (output === process.stdout || output === null) {
        resolve();
      } else {
        output.end(resolve);
      }
    });
  });
}

async function connectionDataForTarget(
  client: MittwaldAPIV2Client,
  target: RunTarget,
): Promise<SSHConnectionData> {
  if ("appInstallationId" in target) {
    return getSSHConnectionForAppInstallation(client, target.appInstallationId);
  } else {
    return getSSHConnectionForProject(client, target.projectId);
  }
}
