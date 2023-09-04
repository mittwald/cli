import { BaseCommand } from "../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import * as child_process from "child_process";
import { appInstallationFlags } from "../../lib/app/flags.js";
import { Flags } from "@oclif/core";
import * as path from "path";

export default class Ssh extends BaseCommand {
  static description = "Connect to an app via SSH";

  static args = { ...appInstallationFlags };
  static flags = {
    cd: Flags.boolean({
      summary: "change to installation path after connecting",
      default: true,
      allowNo: true,
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Ssh);
    const id = args["installation-id"];

    const appInstallationResponse = await this.apiClient.app.getAppinstallation(
      {
        appInstallationId: id,
      },
    );

    assertStatus(appInstallationResponse, 200);

    if (appInstallationResponse.data.projectId === undefined) {
      throw new Error("Project ID of app must not be undefined");
    }

    const projectResponse = await this.apiClient.project.getProject({
      id: appInstallationResponse.data.projectId,
    });

    assertStatus(projectResponse, 200);

    const userResponse = await this.apiClient.user.getOwnAccount();

    assertStatus(userResponse, 200);

    const sshHost = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
    const sshUser = `${userResponse.data.email}@app-${appInstallationResponse.data.id}`;

    this.log("connecting to %o as %o", sshHost, sshUser);
    let cmd = "exec bash -l";

    if (flags.cd) {
      const absoluteInstallPath = path.join(
        projectResponse.data.directories["Web"],
        appInstallationResponse.data.installationPath,
      );
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
