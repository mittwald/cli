import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

const installer = new AppInstaller(
  "8d404bff-6d75-4833-9eed-1b83b0552585",
  "Joomla!",
  [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
    "wait",
  ] as const,
);

export default class InstallJoomla extends ExecRenderBaseCommand<
  typeof InstallJoomla,
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
