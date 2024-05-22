import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const shopware6Installer = new AppInstaller(
  "12d54d05-7e55-4cf3-90c4-093516e0eaf8",
  "Shopware 6",
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
    "wait",
  ] as const,
);

export default class InstallShopware6 extends ExecRenderBaseCommand<
  typeof InstallShopware6,
  AppInstallationResult
> {
  static description = shopware6Installer.description;
  static flags = shopware6Installer.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return shopware6Installer.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return shopware6Installer.render(result, this.flags);
  }
}
