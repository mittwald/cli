import { type MittwaldAPIV2 } from "@mittwald/api-client";
import { readFile } from "fs/promises";
import { parse } from "envfile";
import { ContainerServiceInput } from "./types.js";

type ContainerServiceDeclareRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceDeclareRequest;

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

export async function enrichStackDefinition(
  input: StackRequest,
): Promise<StackRequest> {
  const enriched = structuredClone(input);

  for (const serviceName of Object.keys(input.services ?? {})) {
    let service = enriched.services![serviceName] as ContainerServiceInput;

    service = await setEnvironmentFromEnvFile(service);

    enriched.services![serviceName] = service as ContainerServiceDeclareRequest;
  }

  return enriched;
}

async function setEnvironmentFromEnvFile(
  service: Readonly<ContainerServiceInput>,
): Promise<ContainerServiceInput> {
  if (!service.env_file) {
    return service;
  }

  const enriched = structuredClone(service) as ContainerServiceInput;
  const envFileContent = await readFile(service.env_file, "utf-8");
  const envVars = parse(envFileContent);

  delete enriched.env_file;
  enriched.envs = {
    ...envVars,
    ...(enriched.envs ?? {}),
  };

  return enriched;
}
