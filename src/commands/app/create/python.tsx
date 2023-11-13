import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";

export const pythonInstaller = new AppInstaller(
  "be57d166-dae9-4480-bae2-da3f3c6f0a2e",
  "custom python site",
  ["document-root", "site-title", "wait"] as const,
);

export default class InstallPython extends ExecRenderBaseCommand<
  typeof InstallPython,
  AppInstallationResult
> {
  static description = pythonInstaller.description;
  static flags = pythonInstaller.flags;

  protected async exec(): Promise<{ appInstallationId: string }> {
    return pythonInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return pythonInstaller.render(result, this.flags);
  }
}
