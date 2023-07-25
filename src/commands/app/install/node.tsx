import { Flags } from "@oclif/core";
import { normalizeToAppVersionUuid } from "../../../lib/app/versions.js";
import { autofillFlags } from "../../../lib/app/flags.js";
import { waitUntilAppIsInstalled } from "../../../lib/app/wait.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import React from "react";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
import { triggerAppInstallation } from "../../../lib/app/create.js";

export default class AppCreateNodeJs extends ExecRenderBaseCommand<
  typeof AppCreateNodeJs,
  { appInstallationId: string }
> {
  static appName: string = "Node.js";
  static appUuid: string = "3e7f920b-a711-4d2f-9871-661e1b41a2f0";
  static appNecessaryFlags: string[] = ["site-title"];

  static description: string = `Creates new ${AppCreateNodeJs.appName} Installation.`;
  static flags = {
    ...projectFlags,
    ...processFlags,
    "site-title": Flags.string({
      required: false,
      description: `Site Title of the created ${AppCreateNodeJs.appName}.`,
    }),
  };

  protected async exec(): Promise<{ appInstallationId: string }> {
    const process = makeProcessRenderer(
      this.flags,
      `Installing ${AppCreateNodeJs.appName}`,
    );
    let { flags, args } = await this.parse(AppCreateNodeJs);
    const projectId = await withProjectId(
      this.apiClient,
      flags,
      args,
      this.config,
    );

    flags = await autofillFlags(
      this.apiClient,
      process,
      AppCreateNodeJs.appNecessaryFlags,
      flags,
      projectId,
      AppCreateNodeJs.appName,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      this.apiClient,
      flags.version,
      process,
      AppCreateNodeJs.appUuid,
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
      successText = `Your ${AppCreateNodeJs.appName} installation is now complete. Have fun! 🎉`;
    } else {
      successText = `Your ${AppCreateNodeJs.appName} installation has started. Have fun when it's ready! 🎉`;
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
