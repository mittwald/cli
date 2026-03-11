import { spawnSync } from "child_process";
import { projectArgs } from "../../lib/resources/project/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { getSSHConnectionForProject } from "../../lib/resources/ssh/project.js";
import { sshWrapperDocumentation } from "../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../lib/resources/ssh/connection.js";

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

    const sshArgs = buildSSHClientFlags(user, host, this.flags, {
      interactive: true,
      configDir: this.config.configDir,
    });

    spawnSync("/usr/bin/ssh", sshArgs, {
      stdio: "inherit",
    });
  }
}
