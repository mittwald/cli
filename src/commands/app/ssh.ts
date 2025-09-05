import * as child_process from "child_process";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";
import { Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { getSSHConnectionForAppInstallation } from "../../lib/resources/ssh/appinstall.js";
import {
  SSHConnectionFlags,
  sshConnectionFlags,
} from "../../lib/resources/ssh/flags.js";
import { sshWrapperDocumentation } from "../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../lib/resources/ssh/connection.js";
import { generateIntellijConfigs } from "../../lib/intellij/config.js";

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
    "generate-intellij-config": Flags.boolean({
      summary: "generate IntelliJ IDEA SSH and deployment configuration files",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Ssh);
    const appInstallationId = await this.withAppInstallationId(Ssh);

    const { host, user, directory, appShortId } =
      await getSSHConnectionForAppInstallation(
        this.apiClient,
        appInstallationId,
        flags["ssh-user"],
      );

    if (flags["generate-intellij-config"]) {
      generateIntellijConfigs({
        host,
        user,
        directory,
        appShortId,
      });
      this.log(
        "IntelliJ IDEA configuration files generated in .idea/ directory",
      );
      return;
    }

    if (flags.info) {
      this.log("hostname: %o", host);
      this.log("username: %o", user);
      this.log("directory: %o", directory);
      return;
    }

    this.log("connecting to %o as %o", host, user);

    const [cmd, args] = buildSSHCmdAndFlags(user, host, directory, this.flags);

    this.debug("running ssh %o, with command %o", args, cmd);

    if (flags.cd) {
      this.log(
        "changing to %o; use --no-cd to disable this behaviour",
        directory,
      );
    }

    child_process.spawnSync("/usr/bin/ssh", [...args, cmd], {
      stdio: "inherit",
    });
  }
}

function buildSSHCmdAndFlags(
  user: string,
  host: string,
  directory: string,
  flags: SSHConnectionFlags & { test: boolean; cd: boolean },
): [string, string[]] {
  const args = buildSSHClientFlags(user, host, flags, {
    interactive: true,
    additionalFlags: flags.test ? ["-q"] : [],
  });

  if (flags.test) {
    return ["/bin/true", args];
  }

  if (flags.cd) {
    return [`cd ${directory} && exec bash -l`, args];
  }

  return ["exec bash -l", args];
}
