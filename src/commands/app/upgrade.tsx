import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/app/flags.js";
import { projectFlags } from "../../lib/project/flags.js";
import { Flags, ux } from "@oclif/core";
import React, { ReactNode } from "react";
import { Text } from "ink";
import { getAppFromUuid, getAppVersionFromUuid } from "../../lib/app/uuid.js";
import {
  getAvailableTargetAppVersionFromExternalVersion,
  getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates,
} from "../../lib/app/versions.js";
import {
  makeProcessRenderer,
  ProcessFlags,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";

export class UpgradeApp extends ExecRenderBaseCommand<typeof UpgradeApp, void> {
  static description = "Upgrade target app installation to target version";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    "target-version": Flags.string({
      description: "target version to upgrade target app to",
      required: true,
      default: "latest",
    }),
    "show-candidates": Flags.boolean({
      description: "list version candidates the given app can be upgraded to",
    }),
    force: Flags.boolean({
      char: "f",
      description: "Do not ask for confirmation",
    }),
    ...projectFlags,
    ...processFlags,
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags as ProcessFlags,
      "App Upgrade",
    );
    const appInstallationId = await withAppInstallationId(
      this.apiClient,
      UpgradeApp,
      this.flags,
      this.args,
      this.config,
    );

    const currentAppInstallationResponse =
      await this.apiClient.app.getAppinstallation({
        appInstallationId: appInstallationId,
      });
    const currentAppInstallation = currentAppInstallationResponse.data;

    const currentAppUuid: string = currentAppInstallation.appId as string;
    const currentApp = await getAppFromUuid(this.apiClient, currentAppUuid);
    const currentAppVersionUuid = (
      currentAppInstallation.appVersion as { current: string }
    ).current;

    const currentAppVersion = await getAppVersionFromUuid(
      this.apiClient,
      currentAppUuid,
      currentAppVersionUuid,
    );

    const upgradeCandidates =
      await this.apiClient.app.listUpdateCandidatesForAppversion({
        appId: currentAppUuid,
        baseAppVersionId: currentAppVersionUuid,
      });

    if (this.flags["show-candidates"]) {
      process.addInfo(
        <Text>
          Your {currentApp.name} in Version ${currentAppVersion.externalVersion}{" "}
          can currently be upgraded to the following Versions:
        </Text>,
      );
      for (let i = 0; i < upgradeCandidates.data.length; i++) {
        process.addInfo(
          <Text>{upgradeCandidates.data[i].externalVersion}</Text>,
        );
      }
      return;
    }

    let targetAppVersion;

    if (this.flags["target-version"] == "latest") {
      targetAppVersion =
        await getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates(
          this.apiClient,
          currentAppUuid,
          currentAppVersionUuid,
        );
      if (!targetAppVersion) {
        process.complete(
          <Success>
            Your App is already at the lastest available or possible version. ✅
          </Success>,
        );
      }
    } else {
      targetAppVersion = await getAvailableTargetAppVersionFromExternalVersion(
        this.apiClient,
        currentAppUuid,
        currentAppVersionUuid,
        this.flags["target-version"],
      );
      if (!targetAppVersion) {
        process.error(
          "Given target version is not a valid upgrade candidate for the current version of your app. \n" +
            "You can check valid upgrade candidates for your apps with the flag '--show-candidates'",
        );
        return;
      }
    }

    if (!targetAppVersion) {
      process.error("Target App version could not be determined properly.");
      return;
    }

    if (!this.flags.force) {
      const confirmed = await process.addConfirmation(
        <Text>
          Confirm Upgrading {currentApp.name}{" "}
          {currentAppVersion.externalVersion} (description here) to Version{" "}
          {targetAppVersion.externalVersion}
        </Text>,
      );
      if (!confirmed) {
        process.addInfo(<Text>Upgrade will not be triggered.</Text>);
        process.complete(<></>);

        ux.exit(1);
      }
    } else {
      process.addInfo(
        <Text>
          Commencing upgrade of {currentApp.name}
          {currentAppVersion.externalVersion} (description here) to Version
          {targetAppVersion.externalVersion}.
        </Text>,
      );
    }

    this.apiClient.app.patchAppinstallation({
      appInstallationId,
      data: { appVersionId: targetAppVersion.id },
    });

    process.complete(
      <Success>The App Upgrade has been started. Buckle up! 🚀</Success>,
    );
  }

  protected render(): ReactNode {
    return true;
  }
}
