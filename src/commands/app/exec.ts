import * as child_process from "child_process";
import { Args, Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { sshUsageDocumentation } from "../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../lib/resources/ssh/connection.js";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";
import { getSSHConnectionForAppInstallation } from "../../lib/resources/ssh/appinstall.js";
import shellEscape from "shell-escape";

export default class Exec extends ExtendedBaseCommand<typeof Exec> {
  static summary =
    "Execute a command in an app installation via SSH non-interactively.";
  static description = sshUsageDocumentation;

  static args = {
    ...appInstallationArgs,
    command: Args.string({
      description: "Command to execute in the app installation",
      required: true,
    }),
  };

  static flags = {
    ...sshConnectionFlags,
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
  };

  /**
   * Prepare environment variables for the SSH command
   *
   * @param envVars Array of environment variables in KEY=VALUE format
   * @returns Formatted string with export commands
   */
  private prepareEnvironmentVariables(envVars: string[]): string {
    return (
      envVars
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
        .join("; ") + "; "
    );
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Exec);
    const appInstallationId = await this.withAppInstallationId(Exec);

    const { host, user, directory } = await getSSHConnectionForAppInstallation(
      this.apiClient,
      appInstallationId,
      flags["ssh-user"],
    );

    this.log("executing command on %s as %s", host, user);

    const command = args.command;
    const workdir = flags.workdir;

    // Build the command to execute
    let execCommand = "";

    // Add environment variables if provided
    if (flags.env && flags.env.length > 0) {
      execCommand += this.prepareEnvironmentVariables(flags.env);
    }

    // Change to working directory if specified, otherwise use app directory
    if (workdir !== undefined) {
      execCommand += `cd ${shellEscape([workdir])} && `;
    } else {
      execCommand += `cd ${shellEscape([directory])} && `;
    }

    // Add the actual command
    execCommand += command;

    const sshArgs = buildSSHClientFlags(user, host, flags, {
      interactive: false,
    });

    const wrappedExecCommand = shellEscape(["/bin/bash", "-c", execCommand]);

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
