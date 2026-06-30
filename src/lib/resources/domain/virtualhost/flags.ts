import { Flags } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type IngressPath = MittwaldAPIV2.Components.Schemas.IngressPath;

/**
 * Flags for mapping URL paths to targets (apps, URLs or containers) of a
 * virtual host. Shared between the `virtualhost create` and `virtualhost
 * update` commands.
 */
export const pathMappingFlags = {
  "path-to-app": Flags.string({
    summary: "add a path mapping to an app",
    description:
      "This flag can be used to map a specific URL path to an app; the value for this flag should be the URL path and the app ID, separated by a colon, e.g. /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745. You can specify this flag multiple times to map multiple paths to different apps, and also combine it with the other --path-to-* flags.",
    multiple: true,
  }),
  "path-to-url": Flags.string({
    summary: "add a path mapping to an external url",
    multiple: true,
    description:
      "This flag can be used to map a specific URL path to an external URL; the value for this flag should be the URL path and the external URL, separated by a colon, e.g. /:https://redirect.example. You can specify this flag multiple times to map multiple paths to different external URLs, and also combine it with the other --path-to-* flags.",
  }),
  "path-to-container": Flags.string({
    summary: "add a path mapping to a container",
    multiple: true,
    description:
      "This flag can be used to map a specific URL path to a container; the value for this flag should be the URL path, the container ID and the target port, each separated by a colon, e.g. /:3ecaf1a9-6eb4-4869-b811-8a13c3a2e745:80/tcp. You can specify this flag multiple times to map multiple paths to different containers, and also combine it with the other --path-to-* flags.",
  }),
};

/**
 * Builds the list of {@link IngressPath} entries from the values of the
 * {@link pathMappingFlags}.
 */
export function buildIngressPaths(flags: {
  "path-to-app"?: string[];
  "path-to-url"?: string[];
  "path-to-container"?: string[];
}): IngressPath[] {
  const paths: IngressPath[] = [];

  for (const pathToApp of flags["path-to-app"] ?? []) {
    const [path, installationId] = pathToApp.split(":");
    paths.push({ path, target: { installationId } });
  }

  for (const pathToUrl of flags["path-to-url"] ?? []) {
    const [path, ...urlParts] = pathToUrl.split(":");
    const url = urlParts.join(":");
    paths.push({ path, target: { url } });
  }

  for (const pathToContainer of flags["path-to-container"] ?? []) {
    const [path, container, portProtocol] = pathToContainer.split(":", 3);
    paths.push({
      path,
      target: { container: { id: container, portProtocol } },
    });
  }

  return paths;
}
