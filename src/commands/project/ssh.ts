import { Args } from "@oclif/core";
import { BaseCommand } from "../../BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import * as child_process from "child_process";

export default class Ssh extends BaseCommand<typeof Ssh> {
  static description = "Connect to a project via SSH";

  static args = {
    id: Args.string({
      required: true,
      description: "ID of the Project to be retrieved.",
    }),
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(Ssh);
    const { id } = args;

    const projectResponse = await this.apiClient.project.getProject({
      pathParameters: { id },
    });

    const userResponse = await this.apiClient.user.getOwnProfile({
      data: {},
    });

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
