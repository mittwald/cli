import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

const installer = new AppInstaller(
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

export default class InstallContao extends ExecRenderBaseCommand<
  typeof InstallContao,
  AppInstallationResult
> {
  static description = installer.description;
  static flags = installer.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return installer.exec(this.apiClient, this.args, this.flags, this.config);
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return installer.render(result, this.flags);
  }
}
