import { Flags } from "@oclif/core";
import { SSHConnectionFlags } from "../ssh/flags.js";
import { pathExists } from "../../util/fsutil.js";
import path from "path";

export const defaultRsyncFilterFile = ".mw-rsync-filter";

export interface AppInstallationSyncFlags {
  exclude: string[];
  "dry-run": boolean;
  delete: boolean;
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
