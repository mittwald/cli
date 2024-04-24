import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/app/flags.js";
import { projectFlags } from "../../lib/project/flags.js";
import { Flags, ux } from "@oclif/core";
import React, { ReactNode } from "react";
import { Text } from "ink";
import {
  getAppFromUuid,
  getAppInstallationFromUuid,
  getAppVersionFromUuid,
} from "../../lib/app/uuid.js";
import {
  getAllUpgradeCandidatesFromAppInstallationId,
  getAvailableTargetAppVersionFromExternalVersion,
  getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates,
} from "../../lib/app/versions.js";
import {
  makeProcessRenderer,
  ProcessFlags,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";

type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type AppApp = MittwaldAPIV2.Components.Schemas.AppApp;

export class UpgradeApp extends ExecRenderBaseCommand<typeof UpgradeApp, void> {
  static description = "Upgrade target appinstallation to target version";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    "target-version": Flags.string({
      description: "Target version to upgrade target app to.",
    }),
    force: Flags.boolean({
      char: "f",
      description: "Do not ask for confirmation.",
    }),
    ...projectFlags,
    ...processFlags,
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags as ProcessFlags,
      "App upgrade",
    );
    const appInstallationId = await withAppInstallationId(
        this.apiClient,
        UpgradeApp,
        this.flags,
        this.args,
        this.config,
      ),
      currentAppInstallation = await getAppInstallationFromUuid(
        this.apiClient,
        appInstallationId,
      ),
      currentApp = await getAppFromUuid(
        this.apiClient,
        currentAppInstallation.appId as string,
      ),
      currentAppVersion = await getAppVersionFromUuid(
        this.apiClient,
        currentApp.id,
        (currentAppInstallation.appVersion as { current: string }).current,
      );

    const targetAppVersionCandidates =
      await getAllUpgradeCandidatesFromAppInstallationId(
        this.apiClient,
        currentAppInstallation.id,
      );

    if (targetAppVersionCandidates.length == 0) {
      process.addInfo(
        <Text>
          Your {currentApp.name} {currentAppVersion.externalVersion} is already
          Up-To-Date. ✅
        </Text>,
      );
      process.complete(<></>);
      ux.exit(0);
    }

    let targetAppVersion;

    if (this.flags["target-version"] == "latest") {
      targetAppVersion =
        await getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates(
          this.apiClient,
          currentApp.id,
          currentAppVersion.id,
        );
    } else if (this.flags["target-version"]) {
      const targetVersionMatchFromCandidates = targetAppVersionCandidates.find(
        (targetAppVersionCandidate) =>
          targetAppVersionCandidate.externalVersion ===
          this.flags["target-version"],
      );

      if (targetVersionMatchFromCandidates) {
        targetAppVersion = targetVersionMatchFromCandidates;
      } else {
        process.addInfo(
          <Text>
            The given target upgrade version does not seem to be a valid upgrade
            candidate.
          </Text>,
        );
        targetAppVersion = await forceTargetVersionSelection(
          process,
          this.apiClient,
          targetAppVersionCandidates,
          currentApp,
          currentAppVersion,
        );
      }
    } else {
      targetAppVersion = await forceTargetVersionSelection(
        process,
        this.apiClient,
        targetAppVersionCandidates,
        currentApp,
        currentAppVersion,
      );
    }

    if (!targetAppVersion) {
      process.error("Target app version could not be determined properly.");
      return;
    }

    if (!this.flags.force) {
      const confirmed = await process.addConfirmation(
        <Text>
          Confirm upgrading {currentApp.name}{" "}
          {currentAppVersion.externalVersion} (
          {currentAppInstallation.description}) to version{" "}
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
          {currentAppVersion.externalVersion} (
          {currentAppInstallation.description}) to Version
          {targetAppVersion.externalVersion}.
        </Text>,
      );
    }

    this.apiClient.app.patchAppinstallation({
      appInstallationId,
      data: { appVersionId: targetAppVersion.id },
    });

    process.complete(
      <Success>The upgrade has been started. Buckle up! 🚀</Success>,
    );
  }

  protected render(): ReactNode {
    return true;
  }
}

async function forceTargetVersionSelection(
  process: ProcessRenderer,
  apiClient: MittwaldAPIV2Client,
  targetAppVersionCandidates: AppAppVersion[],
  currentApp: AppApp,
  currentAppVersion: AppAppVersion,
) {
  const targetAppVersionString = await process.addSelect(
    `Please select target upgrade for your ${currentApp.name} ${currentAppVersion.externalVersion} from one of the following`,
    [
      {
        value: "latest",
        label: "latest",
      },
      ...targetAppVersionCandidates.map((targetAppVersionCandidate) => ({
        value: targetAppVersionCandidate.externalVersion,
        label: `${targetAppVersionCandidate.externalVersion}`,
      })),
    ],
  );

  if (targetAppVersionString == "latest") {
    return await getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates(
      apiClient,
      currentApp.id,
      currentAppVersion.id,
    );
  } else {
    return await getAvailableTargetAppVersionFromExternalVersion(
      apiClient,
      currentApp.id,
      currentAppVersion.id,
      targetAppVersionString,
    );
  }
}
