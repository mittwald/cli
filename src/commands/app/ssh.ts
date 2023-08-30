import { BaseCommand } from "../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import * as child_process from "child_process";
import { appInstallationFlags } from "../../lib/app/flags.js";

export default class Ssh extends BaseCommand {
  static description = "Connect to an app via SSH";

  static args = { ...appInstallationFlags };

  public async run(): Promise<void> {
    const { args } = await this.parse(Ssh);
    const id = args["installation-id"];

    const appInstallationResponse = await this.apiClient.app.getAppinstallation(
      {
        pathParameters: { appInstallationId: id },
      },
    );

    assertStatus(appInstallationResponse, 200);

    if (appInstallationResponse.data.projectId === undefined) {
      throw new Error("Project ID of app must not be undefined");
    }

    const projectResponse = await this.apiClient.project.getProject({
      pathParameters: { id: appInstallationResponse.data.projectId },
    });

    assertStatus(projectResponse, 200);

    const userResponse = await this.apiClient.user.getOwnAccount();

    assertStatus(userResponse, 200);

    const sshHost = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
    const sshUser = `${userResponse.data.email}@app-${appInstallationResponse.data.id}`;

    this.log("connecting to %o as %o", sshHost, sshUser);

    child_process.spawnSync("/usr/bin/ssh", ["-l", sshUser, sshHost], {
      stdio: "inherit",
    });
  }
}
