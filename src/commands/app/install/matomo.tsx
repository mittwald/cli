import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

const matomoInstaller = new AppInstaller(
  "91fa05e7-34f7-42e8-a8d3-a9c42abd5f8c",
  "Matomo",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "site-title",
    "wait",
  ] as const,
);

export default class InstallMatomo extends ExecRenderBaseCommand<
  typeof InstallMatomo,
  AppInstallationResult
> {
  static description = matomoInstaller.description;
  static flags = matomoInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return matomoInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return matomoInstaller.render(result, this.flags);
  }
}
