import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/resources/app/flags.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { Flags, ux } from "@oclif/core";
import React, { ReactNode } from "react";
import { Text } from "ink";
import {
  getAppFromUuid,
  getAppInstallationFromUuid,
  getAppVersionFromUuid,
} from "../../lib/resources/app/uuid.js";
import {
  getAllUpgradeCandidatesFromAppInstallationId,
  getAvailableTargetAppVersionFromExternalVersion,
  getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates,
} from "../../lib/resources/app/versions.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Success } from "../../rendering/react/components/Success.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { waitUntilAppStateHasNormalized } from "../../lib/resources/app/wait.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { waitFlags } from "../../lib/wait.js";
import { ProcessFlags } from "../../rendering/process/process_flags.js";
import semver from "semver";

type AppApp = MittwaldAPIV2.Components.Schemas.AppApp;
type AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type AppSystemSoftwareVersion =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
type AppSystemSoftwareDependency =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareDependency;
type AppUpgradePayload = Parameters<
  MittwaldAPIV2Client["app"]["patchAppinstallation"]
>[0]["data"];

export class UpgradeApp extends ExecRenderBaseCommand<typeof UpgradeApp, void> {
  static description = "Upgrade app installation to target version";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    "target-version": Flags.string({
      description:
        "target version to upgrade app to; if omitted, target version will be prompted interactively. May also be a semantic versioning range, e.g. ^1.0.0. If set to 'latest', the latest available version will be used.",
    }),
    force: Flags.boolean({
      char: "f",
      summary: "do not ask for confirmation.",
    }),
    ...projectFlags,
    ...processFlags,
    ...waitFlags,
  };

  protected async exec(): Promise<void> {
    const process = makeProcessRenderer(
      this.flags as ProcessFlags,
      "App upgrade",
    );
    const appInstallationId: string = await withAppInstallationId(
      this.apiClient,
      UpgradeApp,
      this.flags,
      this.args,
      this.config,
    );
    const currentAppInstallation: AppAppInstallation =
        await getAppInstallationFromUuid(this.apiClient, appInstallationId),
      currentApp: AppApp = await getAppFromUuid(
        this.apiClient,
        currentAppInstallation.appId,
      );
    const targetAppVersionCandidates: AppAppVersion[] =
      await getAllUpgradeCandidatesFromAppInstallationId(
        this.apiClient,
        currentAppInstallation.id,
      );

    if (currentAppInstallation.appVersion.current === undefined) {
      process.error("Current version could not be determined properly.");
      ux.exit(1);
    }

    const currentAppVersion: AppAppVersion = await getAppVersionFromUuid(
      this.apiClient,
      currentApp.id,
      currentAppInstallation.appVersion.current,
    );

    if (targetAppVersionCandidates.length == 0) {
      process.complete(
        <Text>
          Your {currentApp.name} {currentAppVersion.externalVersion} is already
          Up-To-Date. ✅
        </Text>,
      );
      return;
    }

    const targetAppVersion = await this.determineTargetAppVersion(
      currentApp,
      currentAppVersion,
      targetAppVersionCandidates,
      process,
    );

    if (!targetAppVersion) {
      process.error("Target app version could not be determined properly.");
      ux.exit(1);
    }

    if (!this.flags.force) {
      const confirmed: boolean = await process.addConfirmation(
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
          Commencing upgrade of {currentApp.name}{" "}
          {currentAppVersion.externalVersion} (
          {currentAppInstallation.description}) to Version{" "}
          {targetAppVersion.externalVersion}.
        </Text>,
      );
    }

    const appUpgradePayload: AppUpgradePayload = {
      appVersionId: targetAppVersion.id,
    };

    const missingDependencies =
      await this.apiClient.app.getMissingDependenciesForAppinstallation({
        queryParameters: {
          targetAppVersionID: targetAppVersion.id,
        },
        appInstallationId,
      });

    if (missingDependencies.data.missingSystemSoftwareDependencies) {
      appUpgradePayload.systemSoftware = {};
      process.addStep(
        <Text>
          In order to upgrade your {currentApp.name} to Version{" "}
          {targetAppVersion.externalVersion} some dependencies need to be
          upgraded too.
        </Text>,
      );
      for (const missingSystemSoftwareDependency of missingDependencies.data
        .missingSystemSoftwareDependencies as AppSystemSoftwareDependency[]) {
        const dependencyUpdateData =
          await updateMissingSystemSoftwareDependency(
            process,
            this.apiClient,
            missingSystemSoftwareDependency,
          );
        appUpgradePayload.systemSoftware[
          dependencyUpdateData.dependencySoftwareId
        ] = {
          systemSoftwareVersion: dependencyUpdateData.dependencyTargetVersionId,
        };
      }

      if (!this.flags.force) {
        const confirmed: boolean = await process.addConfirmation(
          <Text>Do you want to continue?</Text>,
        );
        if (!confirmed) {
          process.addInfo(<Text>Upgrade will not be triggered.</Text>);
          process.complete(<></>);
          ux.exit(1);
        }
      }
    }

    const patchAppTriggerResponse =
      await this.apiClient.app.patchAppinstallation({
        appInstallationId,
        data: appUpgradePayload,
      });

    assertStatus(patchAppTriggerResponse, 204);

    let successText: string;

    if (this.flags.wait) {
      await waitUntilAppStateHasNormalized(
        this.apiClient,
        process,
        appInstallationId,
        "waiting for app upgrade to be done",
        this.flags["wait-timeout"],
      );
      successText =
        "The upgrade finished successfully. Please check if everything is in its place. 🔎";
    } else {
      successText = "The upgrade has been started. Buckle up! 🚀";
    }
    await process.complete(<Success>{successText}</Success>);
  }

  /**
   * Determines the target application version based on the provided input and
   * available upgrade candidates.
   *
   * @param currentApp The current application instance.
   * @param currentAppVersion The current version of the application.
   * @param targetAppVersionCandidates List of potential target application
   *   versions.
   * @param process The process renderer to handle user interactions and display
   *   information.
   * @returns The determined target application version, or undefined if not
   *   resolved.
   */
  private async determineTargetAppVersion(
    currentApp: AppApp,
    currentAppVersion: AppAppVersion,
    targetAppVersionCandidates: AppAppVersion[],
    process: ProcessRenderer,
  ): Promise<AppAppVersion | undefined> {
    const targetAppVersionString = this.flags["target-version"];

    if (targetAppVersionString == "latest") {
      return await getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates(
        this.apiClient,
        currentApp.id,
        currentAppVersion.id,
      );
    }

    if (targetAppVersionString) {
      const exactVersionMatch: AppAppVersion | undefined =
        targetAppVersionCandidates.find(
          (v) => v.externalVersion === targetAppVersionString,
        );

      if (exactVersionMatch) {
        return exactVersionMatch;
      }

      const semverMatch: AppAppVersion | undefined =
        targetAppVersionCandidates.findLast((v) =>
          semver.satisfies(v.externalVersion, targetAppVersionString),
        );
      if (semverMatch) {
        return semverMatch;
      }

      process.addInfo(
        <Text>
          The given target upgrade version does not seem to be a valid upgrade
          candidate.
        </Text>,
      );
    }

    return await forceTargetVersionSelection(
      process,
      this.apiClient,
      targetAppVersionCandidates,
      currentApp,
      currentAppVersion,
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
): Promise<AppAppVersion | undefined> {
  const targetAppVersionString = await process.addSelect(
    `Please select target upgrade for your ${currentApp.name} ${currentAppVersion.externalVersion} from one of the following`,
    [
      ...targetAppVersionCandidates.map((targetAppVersionCandidate) => ({
        value: targetAppVersionCandidate.externalVersion,
        label: `${targetAppVersionCandidate.externalVersion}`,
      })),
    ],
  );

  return await getAvailableTargetAppVersionFromExternalVersion(
    apiClient,
    currentApp.id,
    currentAppVersion.id,
    targetAppVersionString,
  );
}

async function updateMissingSystemSoftwareDependency(
  process: ProcessRenderer,
  apiClient: MittwaldAPIV2Client,
  dependency: AppSystemSoftwareDependency,
) {
  const dependencySoftware = await apiClient.app.getSystemsoftware({
    systemSoftwareId: dependency.systemSoftwareId,
  });
  assertStatus(dependencySoftware, 200);

  const dependencyVersionList = await apiClient.app.listSystemsoftwareversions({
    systemSoftwareId: dependency.systemSoftwareId,
    queryParameters: {
      versionRange: dependency.versionRange,
      recommended: true,
    },
  });
  assertStatus(dependencyVersionList, 200);

  let dependencyTargetVersion: AppSystemSoftwareVersion = {
    id: "not yet set",
    externalVersion: "0.0.0",
    internalVersion: "0.0.0",
  };

  for (const dependencyVersion of dependencyVersionList.data) {
    if (
      semver.gt(
        dependencyVersion.internalVersion,
        dependencyTargetVersion.internalVersion,
      )
    ) {
      dependencyTargetVersion = dependencyVersion;
    }
  }

  if (dependencyTargetVersion.internalVersion == "0.0.0") {
    throw new Error(
      "Dependency Target Version for " +
        dependencySoftware.data.name +
        " could not be determined",
    );
  } else {
    process.addInfo(
      <Text>
        {dependencySoftware.data.name as string} will be upgraded to Version{" "}
        {dependencyTargetVersion.externalVersion}.
      </Text>,
    );

    return {
      dependencySoftwareId: dependencySoftware.data.id as string,
      dependencyTargetVersionId: dependencyTargetVersion.id,
    };
  }
}
