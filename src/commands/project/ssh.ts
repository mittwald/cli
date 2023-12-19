import { assertStatus } from "@mittwald/api-client-commons";
import * as child_process from "child_process";
import { projectArgs } from "../../lib/project/flags.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";

export default class Ssh extends ExtendedBaseCommand<typeof Ssh> {
  static description = "Connect to a project via SSH";

  static args = { ...projectArgs };

  public async run(): Promise<void> {
    const projectId = await this.withProjectId(Ssh);

    const projectResponse = await this.apiClient.project.getProject({
      projectId,
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
