import { MittwaldAPIV2 } from "@mittwald/api-client";

type Ingress = MittwaldAPIV2.Components.Schemas.IngressIngress;

/**
 * Build a list of URLs for an app installation from a list of ingresses.
 *
 * @param ingresses A list of ingresses to search for the app installation ID;
 *   typically all ingresses for a project
 * @param appInstallationId The ID of the app installation to search for
 * @returns A list of URLs that point to the app installation
 */
export default function buildAppURLsFromIngressList(
  ingresses: Ingress[],
  appInstallationId: string,
): string[] {
  const matchingURLs = [];
  for (const virtualHost of ingresses) {
    for (const path of virtualHost.paths) {
      if (
        "installationId" in path.target &&
        path.target.installationId === appInstallationId
      ) {
        matchingURLs.push("https://" + virtualHost.hostname + path.path);
      }
    }
  }
  return matchingURLs;
}
