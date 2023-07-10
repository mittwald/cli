import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { isUuid } from "../../Helpers.js";

// Get App UUID from App Name
export async function getAppUuidFromAppName(
  apiClient: MittwaldAPIV2Client,
  softwareName: string,
): Promise<string> {
  const apps = await apiClient.app.listApps();
  assertStatus(apps, 200);

  const foundApp = apps.data.find((item) => {
    return (
      item.name.toLowerCase().replace(/[!. ]/g, "") ===
      softwareName.toLowerCase().replace(/[!. ]/g, "")
    );
  });

  if (foundApp) {
    return foundApp.id;
  }
  throw new Error("Access Denied.");
}

// Get App Human readable Name from App UUID
export async function getAppNameFromUuid(
  apiClient: MittwaldAPIV2Client,
  uuid: string,
): Promise<string> {
  if (!isUuid(uuid)) {
    throw new Error("Given UUID not valid.");
  }

  const apps = await apiClient.app.listApps();
  assertStatus(apps, 200);

  const foundApp = apps.data.find((item) => {
    return item.id === uuid;
  });

  if (foundApp) {
    return foundApp.name as string;
  }
  throw new Error("App not found.");
}

// Get App Human Readable Version from App Version
export async function getAppVersionFromUuid(
  apiClient: MittwaldAPIV2Client,
  appId: string,
  appVersionId: string,
): Promise<string> {
  if (!isUuid(appId) && !isUuid(appVersionId)) {
    throw new Error("Given UUID not valid.");
  }

  const appVersion = await apiClient.app.getAppversion({
    pathParameters: { appId: appId, appVersionId: appVersionId },
  });

  if (appVersion.data.externalVersion) {
    return appVersion.data.externalVersion as string;
  }
  throw new Error("AppVersion not found.");
}
