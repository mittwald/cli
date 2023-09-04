import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { isProjectShortId, isUuid } from "./Helpers.js";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
import AppApp = MittwaldAPIV2.Components.Schemas.AppApp;

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

export async function getCustomerUuidFromCustomerNumber(
  apiClient: MittwaldAPIV2Client,
  shortId: string,
): Promise<string> {
  const customers = await apiClient.customer.listCustomers();
  assertStatus(customers, 200);

  const foundCustomer = customers.data.find((item) => {
    return item.customerNumber === shortId;
  });

  if (foundCustomer) {
    return foundCustomer.customerId;
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

export async function getAppFromUuid(
  apiClient: MittwaldAPIV2Client,
  uuid: string,
): Promise<AppApp> {
  if (!isUuid(uuid)) {
    throw new Error("Given UUID not valid.");
  }

  const apps = await apiClient.app.listApps();
  assertStatus(apps, 200);

  const foundApp = apps.data.find((item) => {
    return item.id === uuid;
  });

  if (foundApp) {
    return foundApp;
  }

  throw new Error("App not found.");
}

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
