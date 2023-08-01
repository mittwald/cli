import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

const installer = new AppInstaller(
  "3e7f920b-a711-4d2f-9871-661e1b41a2f0",
  "Node.js Project",
  ["version", "site-title", "wait"] as const,
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
