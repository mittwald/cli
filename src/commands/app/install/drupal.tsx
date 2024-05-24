import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const drupalInstaller = new AppInstaller(
  "3d8a261a-3d6f-4e09-b68c-bfe90aece514",
  "Drupal",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "site-title",
  ] as const,
);

export default class InstallDrupal extends ExecRenderBaseCommand<
  typeof InstallDrupal,
  AppInstallationResult
> {
  static description = drupalInstaller.description;
  static flags = drupalInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return drupalInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return drupalInstaller.render(result, this.flags);
  }
}
