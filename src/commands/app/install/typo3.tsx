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

export default class AppCreateTypo3 extends ExecRenderBaseCommand<
  typeof AppCreateTypo3,
  { appInstallationId: string }
> {
  static appName: string = "Typo3";
  static appUuid: string = "352971cc-b96a-4a26-8651-b08d7c8a7357";
  static appNecessaryFlags: string[] = [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "site-title",
  ];

  static description: string = `Creates new ${AppCreateTypo3.appName} Installation.`;
  static flags = {
    ...projectFlags,
    ...processFlags,
    version: Flags.string({
      required: true,
      description: `Version of the ${AppCreateTypo3.appName} to be created - Defaults to latest`,
      default: "latest",
    }),
    host: Flags.string({
      required: false,
      description: `Host under which your ${AppCreateTypo3.appName} will be available (Needs to be created separately).`,
    }),
    "admin-user": Flags.string({
      required: false,
      description: `First Admin User for your ${AppCreateTypo3.appName}.`,
    }),
    "admin-email": Flags.string({
      required: false,
      description: "First Admin Users E-Mail.",
    }),
    "admin-pass": Flags.string({
      required: false,
      description: "First Admin Users Password.",
    }),
    "site-title": Flags.string({
      required: false,
      description: `Site Title of the created ${AppCreateTypo3.appName}.`,
    }),
    wait: Flags.boolean({
      char: "w",
      description: `Wait for your ${AppCreateTypo3.appName} to be ready.`,
    }),
  };

  protected async exec(): Promise<{ appInstallationId: string }> {
    const process = makeProcessRenderer(
      this.flags,
      `Installing ${AppCreateTypo3.appName}`,
    );
    let { flags, args } = await this.parse(AppCreateTypo3);
    const projectId = await withProjectId(
      this.apiClient,
      flags,
      args,
      this.config,
    );

    flags = await autofillFlags(
      this.apiClient,
      process,
      AppCreateTypo3.appNecessaryFlags,
      flags,
      projectId,
      AppCreateTypo3.appName,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      this.apiClient,
      flags.version,
      process,
      AppCreateTypo3.appUuid,
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
      successText = `Your ${AppCreateTypo3.appName} installation is now complete. Have fun! 🎉`;
    } else {
      successText = `Your ${AppCreateTypo3.appName} installation has started. Have fun when it's ready! 🎉`;
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
