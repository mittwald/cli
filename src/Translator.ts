import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { isUuid, isProjectShortId } from "./Helpers.js";

export async function getProjectUuidFromShortId(
  apiClient: MittwaldAPIV2Client,
  shortId: string,
): Promise<string> {
  if (!isProjectShortId(shortId)) {
    throw new Error("Given ShortID not valid.");
  }

  const projects = await apiClient.project.listProjects();
  assertStatus(projects, 200);

  const foundProject = projects.data.find((item) => {
    return item.shortId === shortId;
  });

  if (foundProject) {
    return foundProject.id;
  }
  throw new Error("Access Denied.");
}

export async function getServerUuidFromShortId(
  apiClient: MittwaldAPIV2Client,
  shortId: string,
): Promise<string> {
  const servers = await apiClient.project.listServers();
  assertStatus(servers, 200);

  const foundServer = servers.data.find((item) => {
    return item.shortId === shortId;
  });

  if (foundServer) {
    return foundServer.id;
  }
  throw new Error("Access Denied.");
}

export async function getConversationUuidFromShortId(
  apiClient: MittwaldAPIV2Client,
  shortId: string,
): Promise<string> {
  const conversations = await apiClient.conversation.listConversations();
  assertStatus(conversations, 200);

  const foundConversation = conversations.data.find((item) => {
    return item.shortId === shortId;
  });

  if (foundConversation) {
    return foundConversation.conversationId;
  }
  throw new Error("Access Denied.");
}

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
