import { Flags } from "@oclif/core";
import { SSHConnectionFlags } from "../ssh/flags.js";
import path from "path";
import { pathExists } from "../../util/fs/pathExists.js";
import { SSHConnectionData } from "../ssh/types.js";

export const defaultRsyncFilterFile = ".mw-rsync-filter";

export interface AppInstallationSyncFlags {
  exclude: string[];
  "dry-run": boolean;
  delete: boolean;
  "sub-directory"?: string;
}

export const appInstallationSyncFlags = (direction: "upload" | "download") => ({
  exclude: Flags.string({
    multiple: true,
    description: "exclude files matching the given pattern",
    default: [],
  }),
  "dry-run": Flags.boolean({
    description: `do not actually ${direction} the app installation`,
    default: false,
  }),
  delete: Flags.boolean({
    description:
      direction === "download"
        ? "delete local files that are not present on the server"
        : "delete remote files that are not present locally",
    default: false,
  }),
  "sub-directory": Flags.string({
    summary: `specify a sub-directory within the app installation to ${direction}`,
    description:
      `This is particularly useful when you only want to ${direction} a specific sub-directory of the app installation, ` +
      "for example when you are using a deployment tool that manages the app installation directory itself, " +
      `and you only want to ${direction} exempt files, like environment specific configuration files or user data.`,
  }),
});

export const filterFileDocumentation =
  `This command will also look for a file named ${defaultRsyncFilterFile} in the current ` +
  "directory and use it as a filter file for rsync. Have a look at " +
  "https://manpages.ubuntu.com/manpages/noble/en/man1/rsync.1.html#filter%20rules " +
  "for more information on how to write filter rules.";

export async function filterFileToRsyncFlagsIfPresent(
  targetDir: string,
  filterFile = defaultRsyncFilterFile,
): Promise<string[]> {
  const filterFilePath = path.join(targetDir, filterFile);

  if (await pathExists(filterFilePath)) {
    return ["--filter", `. ${filterFilePath}`];
  }

  return [];
}

/**
 * Build the rsync connection string for the given SSH connection data and flag
 * inputs.
 *
 * @param host Remote SSH hostname
 * @param directory Remove base directory of the app installation
 * @param user Remote SSH user
 * @param subDirectory Optional sub-directory within the app installation to
 *   sync
 */
export function buildRsyncConnectionString(
  { host, directory, user }: SSHConnectionData,
  { "sub-directory": subDirectory }: AppInstallationSyncFlags,
): string {
  if (subDirectory) {
    directory = path.join(directory, subDirectory).replace(/\/$/, "");
  }

  return `${user}@${host}:${directory}/`;
}

export function appInstallationSyncFlagsToRsyncFlags(
  f: AppInstallationSyncFlags & SSHConnectionFlags,
): string[] {
  const {
    "dry-run": dryRun,
    "ssh-identity-file": sshIdentityFile,
    exclude,
  } = f;

  const rsyncOpts = [
    "--archive",
    "--recursive",
    "--verbose",
    "--progress",
    "--exclude=typo3temp",
  ];
  if (dryRun) {
    rsyncOpts.push("--dry-run");
  }
  if (f.delete) {
    rsyncOpts.push("--delete");
  }
  if (sshIdentityFile) {
    rsyncOpts.push("--rsh", `ssh -i ${sshIdentityFile}`);
  }
  if (exclude?.length > 0) {
    rsyncOpts.push(...exclude.map((e) => `--exclude=${e}`));
  }

  return rsyncOpts;
}
