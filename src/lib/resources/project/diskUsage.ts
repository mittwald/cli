import type { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

type ProjectProject = MittwaldAPIV2.Components.Schemas.ProjectProject;
type ProjectFilesystemUsagesDisk =
  MittwaldAPIV2.Components.Schemas.ProjectFilesystemUsagesDisk;

/**
 * Get the filesystem usage of a project's storage volume.
 *
 * The usage is queried for the project's home directory. Without a directory,
 * the API reports the usage of the root filesystem of the project's runtime
 * environment, which is unrelated to the project's storage volume (see #2195).
 */
export async function getProjectDiskUsage(
  apiClient: MittwaldAPIV2Client,
  project: ProjectProject,
): Promise<ProjectFilesystemUsagesDisk> {
  const directory = project.directories.Home;
  if (!directory) {
    throw new Error(`project ${project.id} has no home directory`);
  }

  const response = await apiClient.projectFileSystem.getDiskUsage({
    projectId: project.id,
    queryParameters: { directory },
  });
  assertStatus(response, 200);
  return response.data;
}
