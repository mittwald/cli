import * as child_process from "child_process";
import { projectArgs } from "../../lib/project/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { sshConnectionFlags } from "../../lib/ssh/flags.js";
import { getSSHConnectionForProject } from "../../lib/ssh/project.js";
import { sshWrapperDocumentation } from "../../lib/ssh/doc.js";

export default class Ssh extends ExtendedBaseCommand<typeof Ssh> {
  static summary = "Connect to a project via SSH";
  static description =
    "Establishes an interactive SSH connection to a project.\n\n" +
    sshWrapperDocumentation;

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
