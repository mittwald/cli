import cp, { ChildProcessByStdio } from "child_process";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { SSHConnectionData } from "./types.js";
import { getSSHConnectionForAppInstallation } from "./appinstall.js";
import { getSSHConnectionForProject } from "./project.js";
import { Readable, Writable } from "stream";
import { buildSSHClientFlags } from "./connection.js";
import { SSHConnectionFlags } from "./flags.js";

export type RunTarget = { appInstallationId: string } | { projectId: string };

export type RunCommand =
  | { command: string; args: string[] }
  | { shell: string };

export interface RunIO {
  input: NodeJS.ReadableStream | null;
  output: NodeJS.WritableStream | null;
}

export async function executeViaSSH(
  client: MittwaldAPIV2Client,
  sshConnectionFlags: SSHConnectionFlags,
  target: RunTarget,
  command: RunCommand,
  { input = null, output = null }: RunIO,
  configDir: string,
): Promise<void> {
  const { user, host } = await connectionDataForTarget(
    client,
    target,
    sshConnectionFlags["ssh-user"],
  );
  const sshCommandArgs =
    "shell" in command
      ? ["bash", "-c", command.shell]
      : [command.command, ...command.args];

  const sshArgs = buildSSHClientFlags(user, host, sshConnectionFlags, {
    interactive: false,
    configDir,
  });

  const ssh = cp.spawn("ssh", [...sshArgs, ...sshCommandArgs], {
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
          rej(new Error(`command exited with code ${code}\n${err}`));
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
  sshUser: string | undefined,
): Promise<SSHConnectionData> {
  if ("appInstallationId" in target) {
    return getSSHConnectionForAppInstallation(
      client,
      target.appInstallationId,
      sshUser,
    );
  } else {
    return getSSHConnectionForProject(client, target.projectId, sshUser);
  }
}
