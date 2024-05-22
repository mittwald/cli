import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const moodleInstaller = new AppInstaller(
  "5ba3b4ea-9f79-460a-bbef-d901beca4cf1",
  "Moodle",
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

export default class InstallMoodle extends ExecRenderBaseCommand<
  typeof InstallMoodle,
  AppInstallationResult
> {
  static description = moodleInstaller.description;
  static flags = moodleInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return moodleInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return moodleInstaller.render(result, this.flags);
  }
}
