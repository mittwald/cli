import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../lib/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { Success } from "../../rendering/react/components/Success.js";
import { ReactNode } from "react";
import { getSSHConnectionForAppInstallation } from "../../lib/app/ssh.js";
import { spawn } from "child_process";

export class Download extends ExecRenderBaseCommand<typeof Download, void> {
  static description =
    "Download the filesystem of an app within a project to your local machine";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    ...processFlags,
    target: Flags.directory({
      description: "target directory to download the app installation to",
      required: true,
      exists: false,
    }),
  };

  protected async exec(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Download);
    const targetDirectory = this.flags["target"];

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

    const downloadStep = p.addStep("downloading app installation");

    const child = spawn(
      "rsync",
      [
        "--archive",
        "--recursive",
        "--verbose",
        // "--delete",
        // "--dry-run",
        `${user}@${host}:${directory}`,
        targetDirectory,
      ],
      {
        // stdio: "inherit",
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

    p.complete(<Success>App successfully copied; have fun! 🚀</Success>);
  }

  protected render(): ReactNode {
    return undefined;
  }
}
