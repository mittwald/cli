import {
  assertStatus,
  type MittwaldAPIV2,
  MittwaldAPIV2Client,
} from "@mittwald/api-client";

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

export async function enrichStackDefinition(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  input: StackRequest,
): Promise<StackRequest> {
  const enriched = structuredClone(input);

  for (const serviceName of Object.keys(input.services ?? {})) {
    const service = enriched.services![serviceName];

    const resp = await apiClient.container.getContainerImageConfig({
      queryParameters: {
        imageReference: service.image,
        useCredentialsForProjectId: projectId,
      },
    });

    assertStatus(resp, 200);

    if (service.command === undefined) {
      let command = resp.data.command;
      if (typeof command === "string") {
        command = [command];
      }

      service.command = command;
    }

    if (service.entrypoint === undefined) {
      let entrypoint = resp.data.entrypoint;
      if (typeof entrypoint === "string") {
        entrypoint = [entrypoint];
      }

      service.entrypoint = entrypoint;
    }
  }

  return enriched;
}
