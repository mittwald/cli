import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const typo3Installer = new AppInstaller(
  "352971cc-b96a-4a26-8651-b08d7c8a7357",
  "TYPO3",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "site-title",
    "install-mode",
    "wait",
  ] as const,
);

export default class InstallTYPO3 extends ExecRenderBaseCommand<
  typeof InstallTYPO3,
  AppInstallationResult
> {
  static description = typo3Installer.description;
  static flags = typo3Installer.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return typo3Installer.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return typo3Installer.render(result, this.flags);
  }
}
