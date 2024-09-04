import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Args } from "@oclif/core";
import { Success } from "../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { getSSHConnectionForAppInstallation } from "../../lib/resources/ssh/appinstall.js";
import { spawnInProcess } from "../../rendering/process/process_exec.js";
import { sshConnectionFlags } from "../../lib/resources/ssh/flags.js";
import { sshUsageDocumentation } from "../../lib/resources/ssh/doc.js";
import {
  appInstallationSyncFlags,
  appInstallationSyncFlagsToRsyncFlags,
  filterFileDocumentation,
  filterFileToRsyncFlagsIfPresent,
} from "../../lib/resources/app/sync.js";
import { hasBinaryInPath } from "../../lib/util/fs/hasBinaryInPath.js";

export class Download extends ExecRenderBaseCommand<typeof Download, void> {
  static summary =
    "Download the filesystem of an app within a project to your local machine";
  static description =
    "This command downloads the filesystem of an app installation to your local machine via rsync.\n\n" +
    "For this, rsync needs to be installed on your system.\n\n" +
    sshUsageDocumentation +
    "\n\n" +
    filterFileDocumentation;
  static args = {
    ...appInstallationArgs,
    target: Args.directory({
      description: "target directory to download the app installation to",
      required: true,
      exists: false,
    }),
  };
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
    ...appInstallationSyncFlags("download"),
  };

  protected async exec(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Download);
    const { "dry-run": dryRun, "ssh-user": sshUser } = this.flags;
    const { target } = this.args;

    const p = makeProcessRenderer(this.flags, "Downloading app installation");

    const { host, user, directory } = await p.runStep(
      "getting connection data",
      async () => {
        return getSSHConnectionForAppInstallation(
          this.apiClient,
          appInstallationId,
          sshUser,
        );
      },
    );

    await p.runStep("check if rsync is installed", async () => {
      if (!(await hasBinaryInPath("rsync"))) {
        throw new Error("this command requires rsync to be installed");
      }
    });

    const rsyncOpts = [
      ...appInstallationSyncFlagsToRsyncFlags(this.flags),
      ...(await filterFileToRsyncFlagsIfPresent(target)),
    ];

    await spawnInProcess(
      p,
      "downloading app installation" + (dryRun ? " (dry-run)" : ""),
      "rsync",
      [...rsyncOpts, `${user}@${host}:${directory}/`, target],
    );

    if (dryRun) {
      await p.complete(
        <Success>
          App would (probably) have successfully been downloaded. 🙂
        </Success>,
      );
    } else {
      await p.complete(
        <Success>App successfully downloaded; have fun! 🚀</Success>,
      );
    }
  }

  protected render(): ReactNode {
    return undefined;
  }
}
