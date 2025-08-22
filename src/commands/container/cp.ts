import * as child_process from "child_process";
import * as fs from "fs";
import { Args, Flags } from "@oclif/core";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { getSSHConnectionForContainer } from "../../lib/resources/ssh/container.js";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { withContainerAndStackId } from "../../lib/resources/container/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

export default class Cp extends ExtendedBaseCommand<typeof Cp> {
  static summary =
    "Copy files/folders between a container and the local filesystem";
  static description = `Copy files/folders between a container and the local filesystem.

The syntax is similar to docker cp:
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
    ...sshConnectionFlags,
    ...projectFlags,
    archive: Flags.boolean({
      char: "a",
      summary: "Archive mode (copy all uid/gid information)",
      description: "Preserve file permissions and ownership when copying",
    }),
    recursive: Flags.boolean({
      char: "r",
      summary: "Copy directories recursively",
    }),
    quiet: Flags.boolean({
      char: "q",
      summary: "Suppress progress output",
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
    flags: { archive?: boolean; recursive?: boolean; quiet?: boolean },
  ): string[] {
    const scpArgs = ["-o", "PasswordAuthentication=no"];

    if (flags.archive) {
      scpArgs.push("-p");
    }

    if (flags.recursive) {
      scpArgs.push("-r");
    }

    if (flags.quiet) {
      scpArgs.push("-q");
    }

    scpArgs.push(source, dest);
    return scpArgs;
  }

  public async run(): Promise<void> {
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

    // Get container connection info
    const [containerId, stackId] = await withContainerAndStackId(
      this.apiClient,
      Cp,
      flags,
      { "container-id": containerName },
      this.config,
    );

    const { host, user } = await getSSHConnectionForContainer(
      this.apiClient,
      containerId,
      stackId,
      flags["ssh-user"],
    );

    // Construct source and destination for SCP
    let scpSource: string;
    let scpDest: string;

    if (isDownload) {
      // Download from container to local
      scpSource = `${user}@${host}:${sourceParsed.path}`;
      scpDest = destParsed.path;

      if (!flags.quiet) {
        this.log(
          "Copying from container %s:%s to %s",
          containerName,
          sourceParsed.path,
          scpDest,
        );
      }
    } else {
      // Upload from local to container
      scpSource = sourceParsed.path;
      scpDest = `${user}@${host}:${destParsed.path}`;

      if (!flags.quiet) {
        this.log(
          "Copying from %s to container %s:%s",
          scpSource,
          containerName,
          destParsed.path,
        );
      }
    }

    // Automatically enable recursive for directories
    if (!flags.recursive) {
      try {
        if (!isDownload && fs.existsSync(scpSource)) {
          const stats = fs.statSync(scpSource);
          if (stats.isDirectory()) {
            flags.recursive = true;
            if (!flags.quiet) {
              this.log("Automatically enabling recursive mode for directory");
            }
          }
        }
      } catch (ignored) {
        // Ignore errors when checking if source is a directory
      }
    }

    const scpCommand = this.buildScpCommand(scpSource, scpDest, flags);

    this.debug("running scp with args: %o", scpCommand);

    const result = child_process.spawnSync("/usr/bin/scp", scpCommand, {
      stdio: flags.quiet ? "pipe" : "inherit",
    });

    if (result.status !== 0) {
      if (result.stderr) {
        this.error(`Copy failed: ${result.stderr.toString()}`);
      } else {
        this.error(`Copy failed with exit code ${result.status}`);
      }
    }

    if (!flags.quiet) {
      this.log("Copy completed successfully");
    }
  }
}
