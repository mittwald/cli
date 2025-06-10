import {
  assertStatus,
  type MittwaldAPIV2,
  MittwaldAPIV2Client,
} from "@mittwald/api-client";
import { readFile } from "fs/promises";
import { parse } from "envfile";
import { ContainerServiceInput } from "./types.js";

type ContainerServiceDeclareRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceDeclareRequest;

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

export async function enrichStackDefinition(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  input: StackRequest,
): Promise<StackRequest> {
  const enriched = structuredClone(input);

  for (const serviceName of Object.keys(input.services ?? {})) {
    let service = enriched.services![serviceName] as ContainerServiceInput;

    service = await setCommandAndEntrypointFromImage(
      apiClient,
      projectId,
      service,
    );

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

async function setCommandAndEntrypointFromImage(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  service: Readonly<ContainerServiceInput>,
): Promise<ContainerServiceInput> {
  const enriched = structuredClone(service) as ContainerServiceDeclareRequest;
  const resp = await apiClient.container.getContainerImageConfig({
    queryParameters: {
      imageReference: service.image,
      useCredentialsForProjectId: projectId,
    },
  });

  assertStatus(resp, 200);

  if (service.ports === undefined) {
    enriched.ports = (resp.data.exposedPorts ?? []).map((p) => p.port);
  }

  if (service.command === undefined) {
    let command = resp.data.command;
    if (typeof command === "string") {
      command = [command];
    }

    enriched.command = command;
  }

  if (service.entrypoint === undefined) {
    let entrypoint = resp.data.entrypoint;
    if (typeof entrypoint === "string") {
      entrypoint = [entrypoint];
    }

    enriched.entrypoint = entrypoint;
  }

  return enriched;
}
