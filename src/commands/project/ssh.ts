import { BaseCommand } from "../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import * as child_process from "child_process";
import { projectArgs, withProjectId } from "../../lib/project/flags.js";

export default class Ssh extends BaseCommand {
  static description = "Connect to a project via SSH";

  static args = { ...projectArgs };

  public async run(): Promise<void> {
    const { args } = await this.parse(Ssh);
    const id = await withProjectId(this.apiClient, Ssh, {}, args, this.config);

    const projectResponse = await this.apiClient.project.getProject({
      id,
    });

    const userResponse = await this.apiClient.user.getOwnAccount();

    assertStatus(projectResponse, 200);
    assertStatus(userResponse, 200);

    const sshHost = `ssh.${projectResponse.data.clusterID}.${projectResponse.data.clusterDomain}`;
    const sshUser = `${userResponse.data.email}@${projectResponse.data.shortId}`;

    this.log("connecting to %o as %o", sshHost, sshUser);

    child_process.spawnSync("/usr/bin/ssh", ["-l", sshUser, sshHost], {
      stdio: "inherit",
    });
  }
}
