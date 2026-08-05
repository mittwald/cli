import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { Response } from "@mittwald/api-client-commons";

/**
 * The `app-link-database` and `app-replace-database` operations are marked as
 * deprecated in the mStudio OpenAPI specification, and are therefore no longer
 * part of the generated API client (as of `@mittwald/api-client` 4.431.0). Both
 * endpoints are still served by the API, and no successor operations exist yet,
 * so they are invoked directly via the client's Axios instance here.
 *
 * Once the API offers replacements, these helpers should be dropped in favour
 * of the generated client methods.
 */

type DatabaseUserIds = Record<string, string | undefined>;

/**
 * Mirrors the behaviour of the generated request functions: HTTP error statuses
 * are returned as a regular response instead of being thrown, so that callers
 * can keep using `assertSuccess`/`assertStatus`.
 */
async function requestWithoutStatusValidation(
  apiClient: MittwaldAPIV2Client,
  url: string,
  data: unknown,
): Promise<Response> {
  const response = await apiClient.axios.request({
    url,
    method: "PATCH",
    data,
    validateStatus: () => true,
  });

  return response as Response;
}

/** Links an existing database to an app installation for the given purpose. */
export async function linkDatabase(
  apiClient: MittwaldAPIV2Client,
  appInstallationId: string,
  data: {
    databaseId: string;
    purpose: "primary" | "cache" | "custom";
    databaseUserIds?: DatabaseUserIds;
  },
): Promise<Response> {
  return requestWithoutStatusValidation(
    apiClient,
    `/v2/app-installations/${encodeURIComponent(appInstallationId)}/database`,
    data,
  );
}

/** Replaces the database currently linked to an app installation. */
export async function replaceDatabase(
  apiClient: MittwaldAPIV2Client,
  appInstallationId: string,
  data: {
    oldDatabaseId: string;
    newDatabaseId: string;
    databaseUserIds?: DatabaseUserIds;
  },
): Promise<Response> {
  return requestWithoutStatusValidation(
    apiClient,
    `/v2/app-installations/${encodeURIComponent(appInstallationId)}/database/replace`,
    data,
  );
}
