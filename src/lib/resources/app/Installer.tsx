import { makeProcessRenderer } from "../../../rendering/process/process_flags.js";
import { OutputFlags } from "@oclif/core/interfaces";
import { withProjectId } from "../project/flags.js";
import {
  autofillFlags,
  AvailableFlagName,
  provideSupportedFlags,
  RelevantFlagInput,
} from "./flags.js";
import { normalizeToAppVersionUuid } from "./versions.js";
import { triggerAppInstallation } from "./install.js";
import { waitUntilAppStateHasNormalized } from "./wait.js";
import { Success } from "../../../rendering/react/components/Success.js";
import React from "react";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Config } from "@oclif/core";

type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

type ImplicitDefaultFlag = "wait" | "wait-timeout" | "site-title";

export interface AppInstallationResult {
  appInstallationId: string;
}

export class AppInstaller<TFlagName extends AvailableFlagName> {
  public readonly appId: string;
  public readonly appName: string;
  public readonly appSupportedFlags: readonly TFlagName[];
  public readonly defaultFlagValues: Partial<Record<AvailableFlagName, string>>;
  public readonly description: string;

  public mutateFlags?: (
    flags: RelevantFlagInput<readonly (TFlagName | ImplicitDefaultFlag)[]>,
  ) => unknown;

  private static makeDescription(appName: string): string {
    return `Creates new ${appName} installation.`;
  }

  constructor(
    appId: string,
    appName: string,
    appSupportedFlags: readonly TFlagName[],
    defaultFlagValues: Partial<Record<AvailableFlagName, string>> = {},
  ) {
    this.appId = appId;
    this.appName = appName;
    this.appSupportedFlags = appSupportedFlags;
    this.defaultFlagValues = defaultFlagValues;
    this.description = AppInstaller.makeDescription(appName);
  }

  public get flags(): RelevantFlagInput<
    readonly (TFlagName | ImplicitDefaultFlag)[]
  > {
    const flags = provideSupportedFlags(
      [...this.appSupportedFlags, "wait", "wait-timeout", "site-title"],
      this.appName,
    );

    if (this.mutateFlags) {
      this.mutateFlags(flags);
    }

    return flags;
  }

  public async exec(
    apiClient: MittwaldAPIV2Client,
    args: { [k: string]: unknown },
    flags: OutputFlags<RelevantFlagInput<(TFlagName | ImplicitDefaultFlag)[]>>,
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
      this.defaultFlagValues,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      apiClient,
      "version" in flags ? (flags.version as string) : "latest",
      process,
      this.appId,
    );

    const appInstallationId = await triggerAppInstallation(
      apiClient,
      process,
      projectId,
      flags,
      appVersion,
    );

    let successText: string;
    if (flags.wait) {
      await waitUntilAppStateHasNormalized(
        apiClient,
        process,
        appInstallationId,
        "waiting for app installation to be ready",
        flags["wait-timeout"],
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
