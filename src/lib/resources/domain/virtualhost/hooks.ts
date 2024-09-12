import { assertStatus } from "@mittwald/api-client";
import { useRenderContext } from "../../../../rendering/react/context.js";
import { usePromise } from "@mittwald/react-use-promise";

export function useVirtualHosts(projectId: string) {
  const { apiClient } = useRenderContext();
  const virtualHosts = usePromise(
    (projectId) =>
      apiClient.domain.ingressListIngresses({
        queryParameters: { projectId },
      }),
    [projectId],
  );
  assertStatus(virtualHosts, 200);

  return virtualHosts.data;
}
