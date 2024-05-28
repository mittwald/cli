import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

export async function getDefaultIngressForProject(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
): Promise<string> {
  const projectIngresses = await apiClient.domain.ingressListIngresses({
    queryParameters: {
      projectId,
    },
  });
  assertStatus(projectIngresses, 200);
  const foundIngress = projectIngresses.data.find((item) => {
    return item.isDefault === true;
  });
  if (foundIngress) {
    return foundIngress.hostname;
  }
  throw new Error(`Given ID ${projectId} does not seem to be valid`);
}
