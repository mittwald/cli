import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const pythonInstaller = new AppInstaller(
  "be57d166-dae9-4480-bae2-da3f3c6f0a2e",
  "custom python site",
  ["site-title", "entrypoint"] as const,
);

export default class InstallPython extends ExecRenderBaseCommand<
  typeof InstallPython,
  AppInstallationResult
> {
  static description = pythonInstaller.description;
  static flags = pythonInstaller.flags;

  protected async exec() {
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
