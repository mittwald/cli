import {
  provideSupportedFlags,
  RelevantFlagInput,
} from "../../../lib/app/flags.js";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import React from "react";
import {
  AppInstallationResult,
  AppInstaller,
} from "../../../lib/app/Installer.js";
import { ArrayElement } from "../../../lib/array_types.js";

export default class InstallContao extends ExecRenderBaseCommand<
  typeof InstallContao,
  AppInstallationResult
> {
  static appName = "Contao";
  static appUuid = "4916ce3e-cba4-4d2e-9798-a8764aa14cf3";
  static appSupportedFlags = [
    "version",
    "host",
    "admin-firstname",
    "admin-user",
    "admin-email",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
    "wait",
  ] as const;

  static description = AppInstaller.makeDescription(InstallContao.appName);
  static flags: RelevantFlagInput<typeof InstallContao.appSupportedFlags> =
    provideSupportedFlags(
      InstallContao.appSupportedFlags,
      InstallContao.appName,
    );

  private installer!: AppInstaller<
    ArrayElement<typeof InstallContao.appSupportedFlags>
  >;

  public async init(): Promise<void> {
    await super.init();

    this.installer = new AppInstaller(
      this.apiClient,
      InstallContao.appUuid,
      InstallContao.appName,
      InstallContao.appSupportedFlags,
    );
  }

  protected async exec(): Promise<{ appInstallationId: string }> {
    return this.installer.exec(this.args, this.flags, this.config);
  }

  protected render(result: AppInstallationResult): React.ReactNode {
    return this.installer.render(result, this.flags);
  }
}
