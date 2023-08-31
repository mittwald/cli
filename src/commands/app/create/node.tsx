import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const nodeInstaller = new AppInstaller(
  "3e7f920b-a711-4d2f-9871-661e1b41a2f0",
  "custom Node.js",
  ["site-title", "wait"] as const,
);

export default class InstallNode extends ExecRenderBaseCommand<
  typeof InstallNode,
  AppInstallationResult
> {
  static description = nodeInstaller.description;
  static flags = nodeInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return nodeInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return nodeInstaller.render(result, this.flags);
  }
}
