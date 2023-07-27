import { normalizeToAppVersionUuid } from "../../../lib/app/versions.js";
import {
  autofillFlags,
  provideSupportedFlags,
  RelevantFlagInput,
} from "../../../lib/app/flags.js";
import { waitUntilAppIsInstalled } from "../../../lib/app/wait.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { withProjectId } from "../../../lib/project/flags.js";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { makeProcessRenderer } from "../../../rendering/react/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import React from "react";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
import { triggerAppInstallation } from "../../../lib/app/install.js";
import { OutputFlags } from "@oclif/core/lib/interfaces/parser.js";

export default class AppInstallation extends ExecRenderBaseCommand<
  typeof AppInstallation,
  { appInstallationId: string }
> {
  static appName = "PHP App";
  static appUuid = "34220303-cb87-4592-8a95-2eb20a97b2ac";
  static appSupportedFlags = ["site-title", "wait", "version"] as const;

  static description = `Creates new ${AppInstallation.appName} Installation.`;
  static flags: RelevantFlagInput<typeof AppInstallation.appSupportedFlags> =
    provideSupportedFlags(
      AppInstallation.appSupportedFlags,
      AppInstallation.appName,
    );

  protected async exec(): Promise<{ appInstallationId: string }> {
    const process = makeProcessRenderer(
      this.flags,
      `Installing ${AppInstallation.appName}`,
    );
    const parsed = await this.parse(AppInstallation);
    const args = parsed.args;
    const flags: OutputFlags<typeof AppInstallation.flags> = parsed.flags;

    flags.version = "1.0.0";

    const projectId = await withProjectId(
      this.apiClient,
      flags,
      args,
      this.config,
    );

    await autofillFlags(
      this.apiClient,
      process,
      AppInstallation.appSupportedFlags,
      flags,
      projectId,
      AppInstallation.appName,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      this.apiClient,
      flags.version as unknown as string,
      process,
      AppInstallation.appUuid,
    );

    const [appInstallationId, eventId] = await triggerAppInstallation(
      this.apiClient,
      process,
      projectId,
      flags,
      appVersion,
    );

    let successText: string;
    if (flags.wait) {
      await waitUntilAppIsInstalled(
        this.apiClient,
        process,
        appInstallationId,
        eventId,
      );
      successText = `Your ${AppInstallation.appName} installation is now complete. Have fun! 🎉`;
    } else {
      successText = `Your ${AppInstallation.appName} installation has started. Have fun when it's ready! 🎉`;
    }

    process.complete(<Success>{successText}</Success>);
    return { appInstallationId };
  }

  protected render({
    appInstallationId,
  }: {
    appInstallationId: string;
  }): React.ReactNode {
    if (this.flags.quiet) {
      this.log(appInstallationId);
    }
    return undefined;
  }
}
