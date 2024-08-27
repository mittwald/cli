import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const humhubInstaller = new AppInstaller(
  "e71c238f-f780-4bd4-9492-56f015294db6",
  "HumHub",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
  ] as const,
);

export default class InstallHumhub extends ExecRenderBaseCommand<
  typeof InstallHumhub,
  AppInstallationResult
> {
  static description = humhubInstaller.description;
  static flags = humhubInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return humhubInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return humhubInstaller.render(result, this.flags);
  }
}
