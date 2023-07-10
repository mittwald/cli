import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { gt } from "semver";

type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

// Get latest available Internal App Version for App UUID
export async function getLatestAvailableAppVersionForApp(
  apiClient: MittwaldAPIV2Client,
  appId: string,
): Promise<AppVersion | undefined> {
  const versions = await apiClient.app.listAppversions({
    pathParameters: {
      appId,
    },
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
    pathParameters: {
      appId,
    },
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
