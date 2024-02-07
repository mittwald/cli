import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";

const uuidRegex = RegExp(
  "^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$",
);

export function isUuid(id: string): boolean {
  return uuidRegex.test(id);
}

export async function normalizeProjectId(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
): Promise<string> {
  const result = await apiClient.project.getProject({ projectId });
  assertStatus(result, 200);

  return result.data.id;
}

export async function normalizeServerId(
  apiClient: MittwaldAPIV2Client,
  serverId: string,
): Promise<string> {
  const result = await apiClient.project.getServer({ serverId });
  assertStatus(result, 200);

  return result.data.id;
}

export async function normalizeCustomerId(
  apiClient: MittwaldAPIV2Client,
  customerId: string,
): Promise<string> {
  const customer = await apiClient.customer.getCustomer({ customerId });
  assertStatus(customer, 200);

  return customer.data.customerId;
}

export async function normalizeConversationId(
  apiClient: MittwaldAPIV2Client,
  conversationId: string,
): Promise<string> {
  const conversation = await apiClient.conversation.getConversation({
    conversationId,
  });
  assertStatus(conversation, 200);

  return conversation.data.conversationId;
}

export async function normalizeAppInstallationId(
  apiClient: MittwaldAPIV2Client,
  appInstallationId: string,
): Promise<string> {
  const appInstallations = await apiClient.app.getAppinstallation({
    appInstallationId,
  });
  assertStatus(appInstallations, 200);

  return appInstallations.data.id;
}
