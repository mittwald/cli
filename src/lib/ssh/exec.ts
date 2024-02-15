import cp from "child_process";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { SSHConnectionData } from "./types.js";
import { getSSHConnectionForAppInstallation } from "./appinstall.js";
import { getSSHConnectionForProject } from "./project.js";

export type RunTarget = { appInstallationId: string } | { projectId: string };

export type RunCommand =
  | { command: string; args: string[] }
  | { shell: string };

export async function executeViaSSH(
  client: MittwaldAPIV2Client,
  target: RunTarget,
  command: RunCommand,
  output: NodeJS.WritableStream,
): Promise<void> {
  const { user, host } = await connectionDataForTarget(client, target);
  const sshCommandArgs =
    "shell" in command
      ? ["bash", "-c", command.shell]
      : [command.command, ...command.args];
  const sshArgs = ["-l", user, "-T", host, ...sshCommandArgs];
  const ssh = cp.spawn("ssh", sshArgs, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  let err = "";

  ssh.stdout.pipe(output);
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

      if (output === process.stdout) {
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
