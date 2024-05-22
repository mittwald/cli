import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const neosInstaller = new AppInstaller(
  "1f55f9fa-1902-409c-b305-7e428c5ed64d",
  "NEOS",
  [
    "version",
    "admin-user",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
    "wait",
  ] as const,
);

export default class InstallNeos extends ExecRenderBaseCommand<
  typeof InstallNeos,
  AppInstallationResult
> {
  static description = neosInstaller.description;
  static flags = neosInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return neosInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return neosInstaller.render(result, this.flags);
  }
}
