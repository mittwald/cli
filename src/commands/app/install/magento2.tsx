import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const magento2Installer = new AppInstaller(
  "03c7cd76-7e0d-4504-932c-06947b370020",
  "Magento 2",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
    "shop-email",
    "shop-lang",
    "shop-currency",
    "opensearch-host",
    "opensearch-port",
  ] as const,
);

export default class InstallMagento2 extends ExecRenderBaseCommand<
  typeof InstallMagento2,
  AppInstallationResult
> {
  static description = magento2Installer.description;
  static flags = magento2Installer.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return magento2Installer.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return magento2Installer.render(result, this.flags);
  }
}
