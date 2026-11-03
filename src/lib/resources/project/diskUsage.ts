import type { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

type ProjectFilesystemUsagesDisk =
  MittwaldAPIV2.Components.Schemas.ProjectFilesystemUsagesDisk;

/**
 * Directory whose filesystem usage represents the project's storage.
 *
 * Without a directory, the API reports the usage of the root filesystem of
 * the project's runtime environment, which is unrelated to the project's
 * storage volume (see #2195). The path is resolved relative to the project.
 */
const projectStorageDirectory = "/html";

export async function getProjectDiskUsage(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
): Promise<ProjectFilesystemUsagesDisk> {
  const response = await apiClient.projectFileSystem.getDiskUsage({
    projectId,
    queryParameters: { directory: projectStorageDirectory },
  });
  assertStatus(response, 200);
  return response.data;
}
