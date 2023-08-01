import { makeProcessRenderer } from "../../rendering/process/process_flags.js";
import { ArgOutput, OutputFlags } from "@oclif/core/lib/interfaces/parser.js";
import { withProjectId } from "../project/flags.js";
import {
  autofillFlags,
  AvailableFlagName,
  RelevantFlagInput,
} from "./flags.js";
import { normalizeToAppVersionUuid } from "./versions.js";
import { triggerAppInstallation } from "./install.js";
import { waitUntilAppIsInstalled } from "./wait.js";
import { Success } from "../../rendering/react/components/Success.js";
import React from "react";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Config } from "@oclif/core";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

export interface AppInstallationResult {
  appInstallationId: string;
}

export class AppInstaller<TFlagName extends AvailableFlagName> {
  private readonly apiClient: MittwaldAPIV2Client;
  private readonly appId: string;
  private readonly appName: string;
  private readonly appSupportedFlags: readonly TFlagName[];

  static makeDescription(appName: string): string {
    return `Creates new ${appName} Installation.`;
  }

  constructor(
    apiClient: MittwaldAPIV2Client,
    appId: string,
    appName: string,
    appSupportedFlags: readonly TFlagName[],
  ) {
    this.apiClient = apiClient;
    this.appId = appId;
    this.appName = appName;
    this.appSupportedFlags = appSupportedFlags;
  }

  public async exec(
    args: ArgOutput,
    flags: OutputFlags<RelevantFlagInput<(TFlagName | "version" | "wait")[]>>,
    config: Config,
  ): Promise<AppInstallationResult> {
    const process = makeProcessRenderer(flags, `Installing ${this.appName}`);
    const projectId = await withProjectId(this.apiClient, flags, args, config);

    await autofillFlags(
      this.apiClient,
      process,
      this.appSupportedFlags,
      flags,
      projectId,
      this.appName,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      this.apiClient,
      flags.version as unknown as string,
      process,
      this.appId,
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
      successText = `Your ${this.appName} installation is now complete. Have fun! 🎉`;
    } else {
      successText = `Your ${this.appName} installation has started. Have fun when it's ready! 🎉`;
    }

    process.complete(<Success>{successText}</Success>);
    return { appInstallationId };
  }

  public render(
    result: AppInstallationResult,
    flags: { quiet: boolean },
  ): React.ReactNode {
    if (flags.quiet) {
      return result.appInstallationId;
    }
    return undefined;
  }
}
