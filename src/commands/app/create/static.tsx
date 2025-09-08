import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const staticInstaller = new AppInstaller(
  "d20baefd-81d2-42aa-bfba-9a3220ae839b",
  "custom static site",
  ["document-root", "site-title"] as const,
);

export default class InstallStatic extends ExecRenderBaseCommand<
  typeof InstallStatic,
  AppInstallationResult
> {
  static description = staticInstaller.description;
  static flags = staticInstaller.flags;

  protected async exec() {
    return staticInstaller.exec(
      this.apiClient,
      this.args,
      this.flags,
      this.config,
    );
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return staticInstaller.render(result, this.flags);
  }
}
