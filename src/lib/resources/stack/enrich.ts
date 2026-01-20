import { type MittwaldAPIV2 } from "@mittwald/api-client";
import { readFile } from "fs/promises";
import { parse } from "envfile";
import { ContainerServiceInput } from "./types.js";
import { RawStackInput } from "./types.js";
import { parseEnvironmentVariablesFromArray } from "../../util/parser.js";

type ContainerServiceDeclareRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceDeclareRequest;

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

export async function enrichStackDefinition(
  input: RawStackInput,
): Promise<StackRequest> {
  const enriched = structuredClone(input);

  for (const serviceName of Object.keys(input.services ?? {})) {
    let service = enriched.services![serviceName] as ContainerServiceInput;

    // resolve array into object before enriching
    if (service.envs && Array.isArray(service.envs)) {
      service.envs = parseEnvironmentVariablesFromArray(service.envs);
    }

    service = await setEnvironmentFromEnvFile(service);

    enriched.services![serviceName] = service as ContainerServiceDeclareRequest;
  }

  return enriched as StackRequest;
}

async function setEnvironmentFromEnvFile(
  service: Readonly<ContainerServiceInput>,
): Promise<ContainerServiceInput> {
  if (!service.env_file) {
    return service;
  }

  const enriched = structuredClone(service) as ContainerServiceInput;
  const envFiles = Array.isArray(service.env_file)
    ? service.env_file
    : [service.env_file];

  let envVars = {};

  for (const envFile of envFiles) {
    const envFileContent = await readFile(envFile, "utf-8");
    const fileEnvVars = parse(envFileContent);
    envVars = { ...envVars, ...fileEnvVars };
  }

  delete enriched.env_file;
  enriched.envs = {
    ...envVars,
    ...(enriched.envs ?? {}),
  };

  return enriched;
}
