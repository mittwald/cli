import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import { normalizeProjectIdToUuid } from "../../Helpers.js";

export async function getDefaultIngressForProject(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
): Promise<string> {
  const projectUuid = await normalizeProjectIdToUuid(apiClient, projectId);
  const projectIngresses = await apiClient.domain.ingressListForProject({
    pathParameters: { projectId: projectUuid },
  });
  assertStatus(projectIngresses, 200);
  const foundIngress = projectIngresses.data.find((item) => {
    return item.isDefault === true;
  });
  if (foundIngress) {
    return foundIngress.hostname;
  }
  throw new Error(`Given ID ${projectUuid} does not seem to be valid`);
}
