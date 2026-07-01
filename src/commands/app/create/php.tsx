import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/resources/app/Installer.js";

export const phpInstaller = new AppInstaller(
  "34220303-cb87-4592-8a95-2eb20a97b2ac",
  "custom PHP",
  ["document-root", "site-title", "set"] as const,
);

export default class InstallPhp extends ExecRenderBaseCommand<
  typeof InstallPhp,
  AppInstallationResult
> {
  static description = phpInstaller.description;
  static flags = phpInstaller.flags;
  static examples = [
    {
      description: "Create a PHP app pinned to the latest PHP 8.3 release",
      command:
        "<%= config.bin %> <%= command.id %> --document-root /public --set php=~8.3",
    },
  ];

  protected async exec() {
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
