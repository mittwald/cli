import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { Success } from "../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { hasBinary } from "../../lib/hasbin.js";
import { getSSHConnectionForAppInstallation } from "../../lib/ssh/appinstall.js";
import { spawnInProcess } from "../../rendering/process/process_exec.js";

export class Download extends ExecRenderBaseCommand<typeof Download, void> {
  static description =
    "Download the filesystem of an app within a project to your local machine";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    ...processFlags,
    "dry-run": Flags.boolean({
      description: "do not actually download the app installation",
      default: false,
    }),
    delete: Flags.boolean({
      description: "delete local files that are not present on the server",
      default: false,
    }),
    target: Flags.directory({
      description: "target directory to download the app installation to",
      required: true,
      exists: false,
    }),
  };

  protected async exec(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Download);
    const { "dry-run": dryRun, target, delete: deleteLocal } = this.flags;

    const p = makeProcessRenderer(this.flags, "Downloading app installation");

    const { host, user, directory } = await p.runStep(
      "getting connection data",
      async () => {
        return getSSHConnectionForAppInstallation(
          this.apiClient,
          appInstallationId,
        );
      },
    );

    await p.runStep("check if rsync is installed", async () => {
      if (!(await hasBinary("rsync"))) {
        throw new Error("this command requires rsync to be installed");
      }
    });

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
    if (deleteLocal) {
      rsyncOpts.push("--delete");
    }

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
