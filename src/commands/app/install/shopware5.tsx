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

export default class AppCreateShopware5 extends ExecRenderBaseCommand<
  typeof AppCreateShopware5,
  { appInstallationId: string }
> {
  static appName: string = "Shopware5";
  static appUuid: string = "a23acf9c-9298-4082-9e7d-25356f9976dc";
  static appNecessaryFlags: string[] = [
    "version",
    "host",
    "admin-user",
    "admin-email",
    "admin-pass",
    "admin-firstname",
    "admin-lastname",
    "site-title",
    "shop-email",
    "shop-language",
    "shop-currency",
  ];

  static description: string = `Creates new ${AppCreateShopware5.appName} Installation.`;
  static flags = {
    ...projectFlags,
    ...processFlags,
    version: Flags.string({
      required: true,
      description: `Version of the ${AppCreateShopware5.appName} to be created - Defaults to latest`,
      default: "latest",
    }),
    host: Flags.string({
      required: false,
      description: `Host under which your ${AppCreateShopware5.appName} will be available (Needs to be created separately).`,
    }),
    "admin-user": Flags.string({
      required: false,
      description: `First Admin User for your ${AppCreateShopware5.appName}.`,
    }),
    "admin-email": Flags.string({
      required: false,
      description: "First Admin Users E-Mail.",
    }),
    "admin-pass": Flags.string({
      required: false,
      description: "First Admin Users Password.",
    }),
    "admin-firstname": Flags.string({
      required: false,
      description: "First Admin Users Lastname.",
    }),
    "admin-lastname": Flags.string({
      required: false,
      description: `Site Title of the created ${AppCreateShopware5.appName}.`,
    }),
    "site-title": Flags.string({
      required: false,
      description: `Site Title of the created ${AppCreateShopware5.appName}.`,
    }),
    "shop-email": Flags.string({
      required: false,
      description: `E-Mail with which your ${AppCreateShopware5.appName} communicates initially.`,
    }),
    "shop-language": Flags.string({
      required: false,
      description: `Language with which your ${AppCreateShopware5.appName} works initially`,
    }),
    "shop-currency": Flags.string({
      required: false,
      description: `The initial currency your ${AppCreateShopware5.appName} works with.`,
    }),
    wait: Flags.boolean({
      char: "w",
      description: `Wait for your ${AppCreateShopware5.appName} to be ready.`,
    }),
  };

  protected async exec(): Promise<{ appInstallationId: string }> {
    const process = makeProcessRenderer(
      this.flags,
      `Installing ${AppCreateShopware5.appName}`,
    );
    let { flags, args } = await this.parse(AppCreateShopware5);
    const projectId = await withProjectId(
      this.apiClient,
      flags,
      args,
      this.config,
    );

    flags = await autofillFlags(
      this.apiClient,
      process,
      AppCreateShopware5.appNecessaryFlags,
      flags,
      projectId,
      AppCreateShopware5.appName,
    );

    const appVersion: AppAppVersion = await normalizeToAppVersionUuid(
      this.apiClient,
      flags.version,
      process,
      AppCreateShopware5.appUuid,
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
      successText = `Your ${AppCreateShopware5.appName} installation is now complete. Have fun! 🎉`;
    } else {
      successText = `Your ${AppCreateShopware5.appName} installation has started. Have fun when it's ready! 🎉`;
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
