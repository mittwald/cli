import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const prestashopInstaller = new AppInstaller(
  "3a231de7-6fd2-4aab-9948-45906952752f",
  "PrestaShop",
  [
    "version",
    "host",
    "admin-email",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
    "shop-lang",
    "wait",
  ] as const,
);

export default class InstallPrestashop extends ExecRenderBaseCommand<
  typeof InstallPrestashop,
  AppInstallationResult
> {
  static description = prestashopInstaller.description;
  static flags = prestashopInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return prestashopInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return prestashopInstaller.render(result, this.flags);
  }
}
