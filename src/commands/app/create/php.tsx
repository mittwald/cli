import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const phpInstaller = new AppInstaller(
  "34220303-cb87-4592-8a95-2eb20a97b2ac",
  "custom PHP",
  ["document-root", "site-title", "wait"] as const,
);

export default class InstallPhp extends ExecRenderBaseCommand<
  typeof InstallPhp,
  AppInstallationResult
> {
  static description = phpInstaller.description;
  static flags = phpInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return phpInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return phpInstaller.render(result, this.flags);
  }
}
