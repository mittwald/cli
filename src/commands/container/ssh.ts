import * as child_process from "child_process";
import { Args, Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { getSSHConnectionForContainer } from "../../lib/resources/ssh/container.js";
import {
  SSHConnectionFlags,
  sshConnectionFlags,
} from "../../lib/resources/ssh/flags.js";
import { sshWrapperDocumentation } from "../../lib/resources/ssh/doc.js";
import { buildSSHClientFlags } from "../../lib/resources/ssh/connection.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

export default class Ssh extends ExtendedBaseCommand<typeof Ssh> {
  static summary = "Connect to a container via SSH";
  static description =
    "Establishes an interactive SSH connection to a container.\n\n" +
    sshWrapperDocumentation;

  static args = {
    "container-id": Args.string({
      description: "ID or short ID of the container to connect to",
      required: true,
    }),
  };

  static flags = {
    ...sshConnectionFlags,
    ...projectFlags,
    info: Flags.boolean({
      summary: "only print connection information, without actually connecting",
    }),
    test: Flags.boolean({
      summary: "test connection and exit",
    }),
    shell: Flags.string({
      summary: "shell to use for the SSH connection",
      default: "/bin/sh",
    }),
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Ssh);
    const [containerId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Ssh,
      flags,
      this.args,
      this.config,
    );

    const { host, user, directory } = await getSSHConnectionForContainer(
      this.apiClient,
      containerId,
      stackId,
      flags["ssh-user"],
    );

    if (flags.info) {
      this.log("hostname: %o", host);
      this.log("username: %o", user);
      this.log("directory: %o", directory);
      return;
    }

    this.log("connecting to %o as %o", host, user);

    const [cmd, args] = buildSSHCmdAndFlags(user, host, this.flags);

    this.debug("running ssh %o, with command %o", args, cmd);

    child_process.spawnSync("/usr/bin/ssh", [...args, cmd], {
      stdio: "inherit",
    });
  }
}

function buildSSHCmdAndFlags(
  user: string,
  host: string,
  flags: SSHConnectionFlags & { test: boolean; shell: string },
): [string, string[]] {
  const args = buildSSHClientFlags(user, host, flags, {
    interactive: true,
    additionalFlags: flags.test ? ["-q"] : [],
  });

  if (flags.test) {
    return ["/bin/true", args];
  }

  return [flags.shell, args];
}
