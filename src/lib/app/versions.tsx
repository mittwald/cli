import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { gt } from "semver";
import { Value } from "../../rendering/react/components/Value.js";
type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
import { ProcessRenderer } from "../../rendering/process/process.js";
import { Text } from "ink";
import React from "react";
import { getAppNameFromUuid } from "./uuid.js";

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

// App Version UUID from App Version irellevant if internal or external
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
