import { assertStatus } from "@mittwald/api-client-commons";
import * as child_process from "child_process";
import { appInstallationArgs } from "../../lib/app/flags.js";
import { Flags } from "@oclif/core";
import * as path from "path";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";

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
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Ssh);
    const appInstallationId = await this.withAppInstallationId(Ssh);

    const appInstallationResponse = await this.apiClient.app.getAppinstallation(
      {
        appInstallationId,
      },
    );

    assertStatus(appInstallationResponse, 200);

    if (appInstallationResponse.data.projectId === undefined) {
      throw new Error("Project ID of app must not be undefined");
    }

    const projectResponse = await this.apiClient.project.getProject({
      projectId: appInstallationResponse.data.projectId,
    });

    assertStatus(projectResponse, 200);

    const userResponse = await this.apiClient.user.getOwnAccount();

    assertStatus(userResponse, 200);

    const sshHost = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
    const sshUser = `${userResponse.data.email}@${appInstallationResponse.data.shortId}`;
    const absoluteInstallPath = path.join(
      projectResponse.data.directories["Web"],
      appInstallationResponse.data.installationPath,
    );

    if (flags.info) {
      this.log("hostname: %o", sshHost);
      this.log("username: %o", sshUser);
      this.log("directory: %o", absoluteInstallPath);
      return;
    }

    this.log("connecting to %o as %o", sshHost, sshUser);
    let cmd = "exec bash -l";

    if (flags.cd) {
      cmd = flags.cd ? `cd ${absoluteInstallPath} && exec bash -l` : "bash -l";

      this.log(
        "changing to %o; use --no-cd to disable this behaviour",
        absoluteInstallPath,
      );
    }

    child_process.spawnSync(
      "/usr/bin/ssh",
      ["-t", "-l", sshUser, sshHost, cmd],
      {
        stdio: "inherit",
      },
    );
  }
}
