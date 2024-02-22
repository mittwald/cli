import * as child_process from "child_process";
import { projectArgs } from "../../lib/project/flags.js";
import { ExtendedBaseCommand } from "../../ExtendedBaseCommand.js";
import { sshConnectionFlags } from "../../lib/ssh/flags.js";
import { getSSHConnectionForProject } from "../../lib/ssh/project.js";

export default class Ssh extends ExtendedBaseCommand<typeof Ssh> {
  static description = "Connect to a project via SSH";

  static args = { ...projectArgs };
  static flags = {
    ...sshConnectionFlags,
  };

  public async run(): Promise<void> {
    const projectId = await this.withProjectId(Ssh);

    const { user, host } = await getSSHConnectionForProject(
      this.apiClient,
      projectId,
      this.flags["ssh-user"],
    );

    this.log("connecting to %o as %o", host, user);

    child_process.spawnSync("/usr/bin/ssh", ["-l", user, host], {
      stdio: "inherit",
    });
  }
}
