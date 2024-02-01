import { makeProcessRenderer } from "../../rendering/process/process_flags.js";
import { ArgOutput, OutputFlags } from "@oclif/core/lib/interfaces/parser.js";
import { withProjectId } from "../project/flags.js";
import {
  autofillFlags,
  AvailableFlagName,
  provideSupportedFlags,
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
  public readonly appId: string;
  public readonly appName: string;
  public readonly appSupportedFlags: readonly TFlagName[];
  public readonly description: string;

  public mutateFlags?: (
    flags: RelevantFlagInput<readonly TFlagName[]>,
  ) => unknown;

  private static makeDescription(appName: string): string {
    return `Creates new ${appName} installation.`;
  }

  constructor(
    appId: string,
    appName: string,
    appSupportedFlags: readonly TFlagName[],
  ) {
    this.appId = appId;
    this.appName = appName;
    this.appSupportedFlags = appSupportedFlags;
    this.description = AppInstaller.makeDescription(appName);
  }

  public get flags(): RelevantFlagInput<readonly TFlagName[]> {
    const flags = provideSupportedFlags(this.appSupportedFlags, this.appName);

    if (this.mutateFlags) {
      this.mutateFlags(flags);
    }

    return flags;
  }

  public async exec(
    apiClient: MittwaldAPIV2Client,
    args: ArgOutput,
    flags: OutputFlags<RelevantFlagInput<(TFlagName | "wait")[]>>,
    config: Config,
  ): Promise<AppInstallationResult> {
    const process = makeProcessRenderer(flags, `Installing ${this.appName}`);
    const projectId = await withProjectId(
      apiClient,
      "flag",
      flags,
      args,
      config,
    );

    await autofillFlags(
      apiClient,
      process,
      this.appSupportedFlags,
      flags,
      projectId,
      this.appName,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      apiClient,
      "version" in flags ? (flags.version as string) : "latest",
      process,
      this.appId,
    );

    const [appInstallationId, eventId] = await triggerAppInstallation(
      apiClient,
      process,
      projectId,
      flags,
      appVersion,
    );

    let successText: string;
    if (flags.wait) {
      await waitUntilAppIsInstalled(
        apiClient,
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
