import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { gt } from "semver";
import { Value } from "../../../rendering/react/components/Value.js";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { Text } from "ink";
import React from "react";
import { getAppInstallationFromUuid, getAppNameFromUuid } from "./uuid.js";
import { compare } from "semver";

type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

export async function normalizeToAppVersionUuid(
  apiClient: MittwaldAPIV2Client,
  version: string,
  process: ProcessRenderer,
  appUuid: string,
) {
  let appVersion: AppAppVersion | undefined;

  if (version && version !== "latest") {
    appVersion = await getAppVersionUuidFromAppVersion(
      apiClient,
      appUuid,
      version,
    );
  } else {
    appVersion = await getLatestAvailableAppVersionForApp(apiClient, appUuid);
  }

  if (!appVersion) {
    throw new Error(
      `${await getAppNameFromUuid(
        apiClient,
        appUuid,
      )} version ${version} does not seem to exist for the mStudio.`,
    );
  }

  process.addInfo(
    <Text>
      installing version: <Value>{appVersion.externalVersion}</Value>
    </Text>,
  );

  return appVersion;
}

// Get latest available Internal App Version for App UUID
export async function getLatestAvailableAppVersionForApp(
  apiClient: MittwaldAPIV2Client,
  appId: string,
): Promise<AppVersion | undefined> {
  const versions = await apiClient.app.listAppversions({
    appId,
  });
  assertStatus(versions, 200);
  if (versions.data.length === 0) {
    return undefined;
  }
  let latestVersion = "0.0.0";
  for (const version of versions.data) {
    if (gt(version.internalVersion, latestVersion)) {
      latestVersion = version.internalVersion;
    }
  }
  return versions.data.find(
    (item: AppVersion) => item.internalVersion === latestVersion,
  );
}

export async function getAllUpgradeCandidatesFromAppInstallationId(
  apiClient: MittwaldAPIV2Client,
  appInstallationId: string,
): Promise<AppVersion[]> {
  const currentAppInstallation = await getAppInstallationFromUuid(
      apiClient,
      appInstallationId,
    ),
    updateCandidates = await apiClient.app.listUpdateCandidatesForAppversion({
      appId: currentAppInstallation.appId,
      baseAppVersionId: (
        currentAppInstallation.appVersion as { current: string }
      ).current,
    });
  assertStatus(updateCandidates, 200);
  return sortArrayByExternalVersion(updateCandidates.data);
}

export async function getLatestAvailableTargetAppVersionForAppVersionUpgradeCandidates(
  apiClient: MittwaldAPIV2Client,
  appId: string,
  baseAppVersionId: string,
): Promise<AppVersion | undefined> {
  const versions = await apiClient.app.listUpdateCandidatesForAppversion({
    appId,
    baseAppVersionId,
  });
  assertStatus(versions, 200);
  if (versions.data.length === 0) {
    return undefined;
  }
  let latestVersion: AppVersion | undefined;
  for (const version of versions.data) {
    if (
      gt(version.internalVersion, latestVersion?.internalVersion ?? "0.0.0")
    ) {
      latestVersion = version;
    }
  }
  return latestVersion;
}

export async function getAvailableTargetAppVersionFromExternalVersion(
  apiClient: MittwaldAPIV2Client,
  appId: string,
  baseAppVersionId: string,
  targetExternalVersion: string,
): Promise<AppVersion | undefined> {
  const versions = await apiClient.app.listUpdateCandidatesForAppversion({
    appId,
    baseAppVersionId,
  });
  assertStatus(versions, 200);
  return versions.data.find(
    (item: AppVersion) => item.externalVersion === targetExternalVersion,
  );
}

export async function getAppVersionUuidFromAppVersion(
  apiClient: MittwaldAPIV2Client,
  appId: string,
  appVersion: string | undefined,
): Promise<AppVersion | undefined> {
  const versions = await apiClient.app.listAppversions({
    appId,
  });

  if (!appVersion) {
    return getLatestAvailableAppVersionForApp(apiClient, appId);
  }

  assertStatus(versions, 200);
  return versions.data.find(
    (item: AppVersion) =>
      item.internalVersion === appVersion ||
      item.externalVersion === appVersion,
  );
}

export function sortArrayByExternalVersion(
  versions: AppVersion[],
): AppVersion[] {
  return versions.sort((a: AppVersion, b: AppVersion) =>
    compare(b.externalVersion, a.externalVersion),
  );
}
