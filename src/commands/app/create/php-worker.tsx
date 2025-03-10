import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const phpWorkerInstaller = new AppInstaller(
  "fcac178a-e606-4460-a5fd-b3ad0ae7a3cc",
  "custom PHP worker",
  ["entrypoint", "site-title"] as const,
);

export default class InstallPhpWorker extends ExecRenderBaseCommand<
  typeof InstallPhpWorker,
  AppInstallationResult
> {
  static description = phpWorkerInstaller.description;
  static flags = phpWorkerInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return phpWorkerInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return phpWorkerInstaller.render(result, this.flags);
  }
}
