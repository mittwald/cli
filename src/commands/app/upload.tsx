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
import { sshConnectionFlags } from "../../lib/ssh/flags.js";

export class Upload extends ExecRenderBaseCommand<typeof Upload, void> {
  static summary = "Upload the filesystem of an app to a project";
  static description =
    "Upload the filesystem of an app from your local machine to a project.\n\n" +
    "" +
    "CAUTION: This is a potentially destructive operation. It will overwrite files on the server with the files from your local machine. " +
    "This is NOT a turnkey deployment solution. It is intended for development purposes only.";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    ...processFlags,
    ...sshConnectionFlags,
    "dry-run": Flags.boolean({
      description: "do not actually upload the app installation",
      default: false,
    }),
    delete: Flags.boolean({
      description: "delete remote files that are not present locally",
      default: false,
    }),
    source: Flags.directory({
      description: "source directory from which to upload the app installation",
      required: true,
      exists: true,
    }),
  };

  protected async exec(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Upload);
    const {
      "dry-run": dryRun,
      source,
      delete: deleteRemote,
      "ssh-user": sshUser,
    } = this.flags;

    const p = makeProcessRenderer(this.flags, "Uploading app installation");

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
    if (deleteRemote) {
      rsyncOpts.push("--delete");
    }

    await spawnInProcess(
      p,
      "uploading app installation" + (dryRun ? " (dry-run)" : ""),
      "rsync",
      [...rsyncOpts, source, `${user}@${host}:${directory}/`],
    );

    await p.complete(<UploadSuccess dryRun={dryRun} />);
  }

  protected render(): ReactNode {
    return undefined;
  }
}

function UploadSuccess({ dryRun }: { dryRun: boolean }) {
  if (dryRun) {
    return (
      <Success>
        App would (probably) have successfully been uploaded. 🙂
      </Success>
    );
  }

  return <Success>App successfully uploaded; have fun! 🚀</Success>;
}
