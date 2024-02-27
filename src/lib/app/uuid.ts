import { isUuid } from "../../normalize_id.js";
import {
  assertStatus,
  MittwaldAPIV2,
  MittwaldAPIV2Client,
} from "@mittwald/api-client";

type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type AppApp = MittwaldAPIV2.Components.Schemas.AppApp;

/**
 * Lookup an app by its UUID
 *
 * @param apiClient
 * @param appId
 */
export async function getAppFromUuid(
  apiClient: MittwaldAPIV2Client,
  appId: string,
): Promise<AppApp> {
  const result = await apiClient.app.getApp({ appId });
  assertStatus(result, 200);

  return result.data;
}

/**
 * Lookup an app version by its UUID
 *
 * @param apiClient
 * @param appId
 * @param appVersionId
 */
export async function getAppVersionFromUuid(
  apiClient: MittwaldAPIV2Client,
  appId: string,
  appVersionId: string,
): Promise<AppAppVersion> {
  if (!isUuid(appId) && !isUuid(appVersionId)) {
    throw new Error("Given UUID not valid.");
  }

  const appVersion = await apiClient.app.getAppversion({
    appId: appId,
    appVersionId: appVersionId,
  });

  assertStatus(appVersion, 200);

  return appVersion.data;
}

/**
 * Convert an app name in a format suitable for fuzzy comparison (ignore casing,
 * punctuation, etc.)
 *
 * @param appName
 */
function canonicalizeAppName(appName: string): string {
  return appName.toLowerCase().replace(/[!. ]/g, "");
}

/**
 * Lookup an app by its human readable name
 *
 * @param apiClient
 * @param appName
 */
export async function getAppUuidFromAppName(
  apiClient: MittwaldAPIV2Client,
  appName: string,
): Promise<string> {
  const apps = await apiClient.app.listApps();
  assertStatus(apps, 200);

  const appNameCanonical = canonicalizeAppName(appName);
  const appNameMatches = (item: AppApp): boolean =>
    canonicalizeAppName(item.name) === appNameCanonical;

  const foundApp = apps.data.find(appNameMatches);

  if (foundApp) {
    return foundApp.id;
  }

  throw new Error("Access Denied.");
}

/**
 * Lookup an app name by its UUID
 *
 * @param apiClient
 * @param uuid
 */
export async function getAppNameFromUuid(
  apiClient: MittwaldAPIV2Client,
  uuid: string,
): Promise<string> {
  return (await getAppFromUuid(apiClient, uuid)).name;
}

/**
 * Lookup an app version number by its UUID
 *
 * @param apiClient
 * @param appId
 * @param appVersionId
 */
export async function getAppVersionNumberFromUuid(
  apiClient: MittwaldAPIV2Client,
  appId: string,
  appVersionId: string,
): Promise<string> {
  return (await getAppVersionFromUuid(apiClient, appId, appVersionId))
    .externalVersion;
}
