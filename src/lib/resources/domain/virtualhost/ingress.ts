import type { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";

type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;

export async function getVirtualHost(
  apiClient: MittwaldAPIV2Client,
  ingressId: string,
): Promise<IngressIngress> {
  const response = await apiClient.domain.ingressGetIngress({ ingressId });
  assertStatus(response, 200);
  return response.data;
}
