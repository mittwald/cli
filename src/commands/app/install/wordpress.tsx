import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

const installer = new AppInstaller(
  "da3aa3ae-4b6b-4398-a4a8-ee8def827876",
  "WordPress",
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

export default class InstallContao extends ExecRenderBaseCommand<
  typeof InstallContao,
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
