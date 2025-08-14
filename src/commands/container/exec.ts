import * as child_process from "child_process";
import { Args, Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { getSSHConnectionForContainer } from "../../lib/resources/ssh/container.js";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { sshUsageDocumentation } from "../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../lib/resources/ssh/connection.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import shellEscape from "shell-escape";

export default class Exec extends ExtendedBaseCommand<typeof Exec> {
  static summary = "Execute a command in a container via SSH";
  static description =
    "Executes a command in a container via SSH non-interactively.\n\n" +
    sshUsageDocumentation;

  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to connect to",
      required: true,
    }),
    command: Args.string({
      description: "Command to execute in the container",
      required: true,
    }),
  };

  static flags = {
    ...sshConnectionFlags,
    ...projectFlags,
    workdir: Flags.string({
      char: "w",
      summary: "working directory where the command will be executed",
      default: undefined,
    }),
    env: Flags.string({
      char: "e",
      summary:
        "environment variables to set for the command (format: KEY=VALUE)",
      multiple: true,
    }),
    shell: Flags.string({
      summary: "shell to use for the SSH connection",
      default: "/bin/sh",
    }),
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Exec);
    const [containerId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Exec,
      flags,
      this.args,
      this.config,
    );

    const { host, user } = await getSSHConnectionForContainer(
      this.apiClient,
      containerId,
      stackId,
      flags["ssh-user"],
    );

    this.log("executing command on %s as %s", host, user);

    const command = args.command;
    const workdir = flags.workdir;

    // Build the command to execute
    let execCommand = "";

    // Add environment variables if provided
    if (flags.env && flags.env.length > 0) {
      execCommand += flags.env
        .map((env) => {
          const eqIdx = env.indexOf("=");
          if (eqIdx === -1) {
            // If no '=', treat the whole string as key with empty value
            return `export ${shellEscape([env])}=`;
          }
          const key = env.slice(0, eqIdx);
          const value = env.slice(eqIdx + 1);
          return `export ${shellEscape([key])}=${shellEscape([value])}`;
        })
        .join("; ") + "; ";
    }

    // Change to working directory if specified
    if (workdir !== undefined) {
      execCommand += `cd ${shellEscape([workdir])} && `;
    }

    // Add the actual command
    execCommand += command;

    const sshArgs = buildSSHClientFlags(user, host, flags, {
      interactive: false,
    });

    const wrappedExecCommand = shellEscape([flags.shell, "-c", execCommand]);

    this.debug("running ssh %o, with command %o", sshArgs, wrappedExecCommand);

    const result = child_process.spawnSync(
      "/usr/bin/ssh",
      [...sshArgs, wrappedExecCommand],
      {
        stdio: "inherit",
      },
    );

    if (result.status !== 0) {
      this.error(`Command failed with exit code ${result.status}`);
    }
  }
}
