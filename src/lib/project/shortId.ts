import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

export async function getProjectShortIdFromUuid(
  apiClient: MittwaldAPIV2Client,
  uuid: string,
): Promise<string> {
  const project = await apiClient.project.getProject({
    pathParameters: { id: uuid },
  });
  assertStatus(project, 200);
  if (project.data.shortId) {
    return project.data.shortId;
  }
  throw new Error(`Given ID ${uuid} does not seem to be valid`);
}
