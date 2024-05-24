import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

const installer = new AppInstaller(
  "0b97d59f-ee13-4f18-a1f6-53e1beaf2e70",
  "Nextcloud",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "site-title",
  ] as const,
);

export default class InstallNextcloud extends ExecRenderBaseCommand<
  typeof InstallNextcloud,
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
