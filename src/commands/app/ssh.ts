import * as child_process from "child_process";
import { appInstallationArgs } from "../../lib/app/flags.js";
import { Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { getSSHConnectionForAppInstallation } from "../../lib/ssh/appinstall.js";
import { SSHConnectionFlags, sshConnectionFlags } from "../../lib/ssh/flags.js";
import { sshWrapperDocumentation } from "../../lib/ssh/doc.js";

export default class Ssh extends ExtendedBaseCommand<typeof Ssh> {
  static summary = "Connect to an app via SSH";
  static description =
    "Establishes an interactive SSH connection to an app installation.\n\n" +
    sshWrapperDocumentation;

  static args = { ...appInstallationArgs };
  static flags = {
    ...sshConnectionFlags,
    cd: Flags.boolean({
      summary: "change to installation path after connecting",
      default: true,
      allowNo: true,
    }),
    info: Flags.boolean({
      summary: "only print connection information, without actually connecting",
    }),
    test: Flags.boolean({
      summary: "test connection and exit",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Ssh);
    const appInstallationId = await this.withAppInstallationId(Ssh);

    const { host, user, directory } = await getSSHConnectionForAppInstallation(
      this.apiClient,
      appInstallationId,
      flags["ssh-user"],
    );

    if (flags.info) {
      this.log("hostname: %o", host);
      this.log("username: %o", user);
      this.log("directory: %o", directory);
      return;
    }

    this.log("connecting to %o as %o", host, user);

    const [cmd, args] = buildSSHCmdAndFlags(user, directory, this.flags);

    this.debug("running ssh %o on %o, with command %o", args, host, cmd);

    if (flags.cd) {
      this.log(
        "changing to %o; use --no-cd to disable this behaviour",
        directory,
      );
    }

    child_process.spawnSync("/usr/bin/ssh", [...args, host, cmd], {
      stdio: "inherit",
    });
  }
}

function buildSSHArgs(user: string, flags: SSHConnectionFlags) {
  const args = ["-t", "-l", user];

  if (flags["ssh-identity-file"]) {
    args.push("-i", flags["ssh-identity-file"]);
  }
  return args;
}

function buildSSHCmdAndFlags(
  user: string,
  directory: string,
  flags: SSHConnectionFlags & { test: boolean; cd: boolean },
): [string, string[]] {
  const args = buildSSHArgs(user, flags);

  if (flags.test) {
    return ["/bin/true", [...args, "-q"]];
  }

  if (flags.cd) {
    return [`cd ${directory} && exec bash -l`, args];
  }

  return ["exec bash -l", args];
}
