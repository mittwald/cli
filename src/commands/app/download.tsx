import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { Success } from "../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { spawn } from "child_process";
import { hasBinary } from "../../lib/hasbin.js";
import { getSSHConnectionForAppInstallation } from "../../lib/ssh/appinstall.js";
import { sshConnectionFlags } from "../../lib/ssh/flags.js";

export class Download extends ExecRenderBaseCommand<typeof Download, void> {
  static description =
    "Download the filesystem of an app within a project to your local machine";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
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
    const {
      "dry-run": dryRun,
      target,
      delete: deleteLocal,
      "ssh-user": sshUser,
    } = this.flags;

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
      if (!(await hasBinary("rsync"))) {
        throw new Error("this command requires rsync to be installed");
      }
    });

    const downloadStep = p.addStep(
      "downloading app installation" + (dryRun ? " (dry-run)" : ""),
    );

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

    const child = spawn(
      "rsync",
      [...rsyncOpts, `${user}@${host}:${directory}/`, target],
      {
        shell: false,
      },
    );

    child.stdout.on("data", (chunk) =>
      downloadStep.appendOutput(chunk.toString()),
    );
    child.stderr.on("data", (chunk) =>
      downloadStep.appendOutput(chunk.toString()),
    );
    child.on("exit", (code) => {
      if (code === 0) {
        downloadStep.complete();
      } else {
        downloadStep.error(new Error(`rsync exited with code ${code}`));
      }
    });

    await downloadStep.wait();

    if (dryRun) {
      p.complete(
        <Success>
          App would (probably) have successfully been downloaded. 🙂
        </Success>,
      );
    } else {
      p.complete(<Success>App successfully downloaded; have fun! 🚀</Success>);
    }
  }

  protected render(): ReactNode {
    return undefined;
  }
}
