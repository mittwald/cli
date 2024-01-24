import * as child_process from "child_process";
import { appInstallationArgs } from "../../lib/app/flags.js";
import { Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { getSSHConnectionForAppInstallation } from "../../lib/app/ssh.js";

export default class Ssh extends ExtendedBaseCommand<typeof Ssh> {
  static description = "Connect to an app via SSH";

  static args = { ...appInstallationArgs };
  static flags = {
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
    );

    if (flags.info) {
      this.log("hostname: %o", host);
      this.log("username: %o", user);
      this.log("directory: %o", directory);
      return;
    }

    this.log("connecting to %o as %o", host, user);

    let cmd = "exec bash -l";
    const args = ["-t", "-l", user];

    if (flags.test) {
      cmd = "/bin/true";
      args.push("-q");
    } else if (flags.cd) {
      cmd = flags.cd ? `cd ${directory} && exec bash -l` : "bash -l";

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
