import {
  assertStatus,
  MittwaldAPIV2,
  MittwaldAPIV2Client,
} from "@mittwald/api-client";
import * as fs from "fs/promises";
import { parse } from "envfile";
import { pathExists } from "../../util/fs/pathExists.js";

type ContainerContainerImageConfig =
  MittwaldAPIV2.Components.Schemas.ContainerContainerImageConfig;
type ContainerContainerImageConfigExposedPort =
  MittwaldAPIV2.Components.Schemas.ContainerContainerImageConfigExposedPort;

/**
 * Parses environment variables from command line flags and env files
 *
 * @param envFlags Array of environment variable strings in KEY=VALUE format
 * @param envFiles Array of paths to env files
 * @returns An object containing environment variable key-value pairs
 */
export async function parseEnvironmentVariables(
  envFlags: string[] = [],
  envFiles: string[] = [],
): Promise<Record<string, string>> {
  return {
    ...parseEnvironmentVariablesFromEnvFlags(envFlags),
    ...(await parseEnvironmentVariablesFromFile(envFiles)),
  };
}

/**
 * Parses environment variables from env files
 *
 * @param envFiles Array of paths to env files
 * @returns An object containing environment variable key-value pairs
 */
export async function parseEnvironmentVariablesFromFile(
  envFiles: string[] = [],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const envFile of envFiles) {
    if (!(await pathExists(envFile))) {
      throw new Error(`Env file not found: ${envFile}`);
    }

    const fileContent = await fs.readFile(envFile, { encoding: "utf-8" });
    const parsed = parse(fileContent);

    Object.assign(result, parsed);
  }
  return result;
}

/**
 * Parses environment variables from command line flags
 *
 * @param envFlags Array of environment variable strings in KEY=VALUE format
 * @returns An object containing environment variable key-value pairs
 */
export function parseEnvironmentVariablesFromEnvFlags(
  envFlags: string[] = [],
): Record<string, string> {
  const splitIntoKeyAndValue = (e: string) => {
    const index = e.indexOf("=");
    if (index < 0) {
      throw new Error(`Invalid environment variable format: ${e}`);
    }
    return [e.slice(0, index), e.slice(index + 1)];
  };

  return Object.fromEntries(envFlags.map(splitIntoKeyAndValue));
}

/**
 * Determines which ports to expose based on image metadata
 *
 * @param imageMeta Metadata about the container image
 * @param publishAll Whether to publish all ports defined in the image
 * @param publishPorts Array of port mappings specified by the user
 * @returns An array of port mappings
 */
export function getPortMappings(
  imageMeta: ContainerContainerImageConfig,
  publishAll: boolean = false,
  publishPorts: string[] = [],
): string[] {
  if (publishAll) {
    const definedPorts = imageMeta.exposedPorts ?? [];
    const concatPort = (p: ContainerContainerImageConfigExposedPort) => {
      const [port, protocol = "tcp"] = p.port.split("/", 2);
      return `${port}:${port}/${protocol}`;
    };

    return definedPorts.map(concatPort);
  }

  return publishPorts;
}

/**
 * Retrieves metadata for a container image
 *
 * @param apiClient The API client instance
 * @param image The container image reference
 * @param projectId The project ID for credentials
 * @returns Metadata about the container image
 */
export async function getImageMeta(
  apiClient: MittwaldAPIV2Client,
  image: string,
  projectId: string,
): Promise<ContainerContainerImageConfig> {
  const resp = await apiClient.container.getContainerImageConfig({
    queryParameters: {
      imageReference: image,
      useCredentialsForProjectId: projectId,
    },
  });

  assertStatus(resp, 200);
  return resp.data;
}
