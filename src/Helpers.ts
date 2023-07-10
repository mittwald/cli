import {
  getConversationUuidFromShortId,
  getProjectUuidFromShortId, getServerUuidFromShortId
} from "./Translator.js";
import { MittwaldAPIV2Client } from "@mittwald/api-client";

const uuidRegex = RegExp(
  "^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$",
);
const projectShortIdRegex = RegExp("p-[0-9a-zA-Z]{6}");

export function isUuid(id: string): boolean {
  return uuidRegex.test(id);
}

export function isProjectShortId(id: string): boolean {
  return projectShortIdRegex.test(id);
}

export async function normalizeProjectIdToUuid(
  apiClient: MittwaldAPIV2Client,
  uuidOrShortId: string,
): Promise<string> {
  if (isUuid(uuidOrShortId)) {
    return uuidOrShortId;
  }
  if (isProjectShortId(uuidOrShortId)) {
    return await getProjectUuidFromShortId(apiClient, uuidOrShortId);
  }
  throw new Error(`Given ID ${uuidOrShortId} does not seem to be valid`);
}

export async function normalizeServerIdToUuid(
  apiClient: MittwaldAPIV2Client,
  uuidOrShortId: string,
): Promise<string> {
  if (isUuid(uuidOrShortId)) {
    return uuidOrShortId;
  }

  return await getServerUuidFromShortId(apiClient, uuidOrShortId);
}

export async function normalizeConversationIdToUuid(
  apiClient: MittwaldAPIV2Client,
  uuidOrShortId: string,
): Promise<string> {
  if (isUuid(uuidOrShortId)) {
    return uuidOrShortId;
  }
  return await getConversationUuidFromShortId(apiClient, uuidOrShortId);
}
