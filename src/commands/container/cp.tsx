import * as fs from "fs";
import { Args, Flags } from "@oclif/core";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { getSSHConnectionForContainer } from "../../lib/resources/ssh/container.js";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { getSSHKnownHostsFlags } from "../../lib/resources/ssh/knownhosts.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { spawnInProcess } from "../../rendering/process/process_exec.js";
import { Success } from "../../rendering/react/components/Success.js";
import { ReactNode } from "react";

export default class Cp extends ExecRenderBaseCommand<typeof Cp, void> {
  static summary =
    "Copy files/folders between a container and the local filesystem";
  static description = `The syntax is similar to docker cp:
- Copy from container to host: mw container cp CONTAINER:SRC_PATH DEST_PATH
- Copy from host to container: mw container cp SRC_PATH CONTAINER:DEST_PATH

Where CONTAINER can be a container ID, short ID, or service name.`;

  static examples = [
    "# Copy a file from container to current directory\n<%= config.bin %> <%= command.id %> mycontainer:/app/config.json .",
    "# Copy a file from host to container\n<%= config.bin %> <%= command.id %> ./local-file.txt mycontainer:/app/",
    "# Copy a directory recursively\n<%= config.bin %> <%= command.id %> mycontainer:/var/log ./logs",
    "# Copy with archive mode (preserve permissions)\n<%= config.bin %> <%= command.id %> -a mycontainer:/app/data ./backup",
  ];

  static args = {
    source: Args.string({
      description: "Source path (either local path or CONTAINER:PATH)",
      required: true,
    }),
    dest: Args.string({
      description: "Destination path (either local path or CONTAINER:PATH)",
      required: true,
    }),
  };

  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
    ...projectFlags,
    archive: Flags.boolean({
      char: "a",
      summary: "archive mode (copy all uid/gid information)",
      description: "Preserve file permissions and ownership when copying",
    }),
    recursive: Flags.boolean({
      char: "r",
      summary: "copy directories recursively",
    }),
  };

  private parseContainerPath(path: string): {
    container?: string;
    path: string;
  } {
    const colonIndex = path.indexOf(":");
    if (colonIndex === -1) {
      return { path };
    }

    const container = path.substring(0, colonIndex);
    const containerPath = path.substring(colonIndex + 1);

    // Ensure container path starts with / (absolute path)
    const normalizedPath = containerPath.startsWith("/")
      ? containerPath
      : `/${containerPath}`;

    return { container, path: normalizedPath };
  }

  private buildScpCommand(
    source: string,
    dest: string,
    flags: { archive?: boolean; recursive?: boolean },
  ): string[] {
    const scpArgs = [
      ...getSSHKnownHostsFlags(this.config.configDir),
      "-o",
      "PasswordAuthentication=no",
    ];

    if (flags.archive) {
      scpArgs.push("-p");
    }

    if (flags.recursive) {
      scpArgs.push("-r");
    }

    scpArgs.push(source, dest);
    return scpArgs;
  }

  protected async exec(): Promise<void> {
    const { args, flags } = await this.parse(Cp);
    const sourceParsed = this.parseContainerPath(args.source);
    const destParsed = this.parseContainerPath(args.dest);

    // Validate that exactly one of source or dest is a container path
    if (sourceParsed.container && destParsed.container) {
      this.error(
        "Cannot copy from container to container. One path must be local.",
      );
    }

    if (!sourceParsed.container && !destParsed.container) {
      this.error(
        "At least one path must specify a container (CONTAINER:PATH format).",
      );
    }

    const containerName = sourceParsed.container || destParsed.container!;
    const isDownload = !!sourceParsed.container;

    const p = makeProcessRenderer(
      flags,
      `Copying files ${isDownload ? "from" : "to"} container`,
    );

    // Get container connection info
    const [containerId, stackId] = await p.runStep(
      "getting container connection info",
      async () => {
        return withContainerAndStackId(
          this.apiClient,
          Cp,
          flags,
          { "container-id": containerName },
          this.config,
        );
      },
    );

    const { host, user } = await p.runStep(
      "establishing SSH connection",
      async () => {
        return getSSHConnectionForContainer(
          this.apiClient,
          containerId,
          stackId,
          flags["ssh-user"],
        );
      },
    );

    // Construct source and destination for SCP
    let scpSource: string;
    let scpDest: string;

    if (isDownload) {
      scpSource = `${user}@${host}:${sourceParsed.path}`;
      scpDest = destParsed.path;
    } else {
      scpSource = sourceParsed.path;
      scpDest = `${user}@${host}:${destParsed.path}`;
    }

    // Automatically enable recursive for directories
    const effectiveFlags = { ...flags };
    if (!flags.recursive && !isDownload) {
      try {
        if (fs.existsSync(scpSource)) {
          const stats = fs.statSync(scpSource);
          if (stats.isDirectory()) {
            effectiveFlags.recursive = true;
          }
        }
      } catch (ignored) {
        // Ignore errors when checking if source is a directory
      }
    }

    const scpCommand = this.buildScpCommand(scpSource, scpDest, effectiveFlags);

    await spawnInProcess(
      p,
      `copying files ${isDownload ? "from" : "to"} container`,
      "/usr/bin/scp",
      scpCommand,
    );

    await p.complete(<CopySuccess isDownload={isDownload} />);
  }

  protected render(): ReactNode {
    return undefined;
  }
}

function CopySuccess({ isDownload }: { isDownload: boolean }) {
  return (
    <Success>
      Files successfully {isDownload ? "downloaded from" : "uploaded to"}{" "}
      container! 🚀
    </Success>
  );
}
