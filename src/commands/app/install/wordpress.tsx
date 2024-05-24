import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const wordpressInstaller = new AppInstaller(
  "da3aa3ae-4b6b-4398-a4a8-ee8def827876",
  "WordPress",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "site-title",
  ] as const,
);

export default class InstallWordPress extends ExecRenderBaseCommand<
  typeof InstallWordPress,
  AppInstallationResult
> {
  static description = wordpressInstaller.description;
  static flags = wordpressInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return wordpressInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return wordpressInstaller.render(result, this.flags);
  }
}
