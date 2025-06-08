import type { MittwaldAPIV2 } from "@mittwald/api-client";

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

/**
 * This function is needed to work around the mStudios shitty (and supposedly
 * docker-compose compatible) container stack API.
 *
 * @param stack
 */
export function sanitizeStackDefinition(stack: StackRequest): StackRequest {
  const sanitized = {
    services: structuredClone(stack.services),
    volumes: structuredClone(stack.volumes),
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  for (const serviceKey of Object.keys(sanitized.services ?? {})) {
    const service = sanitized.services![serviceKey];

    if (typeof (service.command as string | string[]) === "string") {
      service.command = [service.command as any as string];
    }

    if (!service.description) {
      service.description = serviceKey;
    }
    if ((service as any).environment) {
      service.envs = (service as any).environment;
      delete (service as any).environment;
    }
    if (!service.envs) {
      service.envs = {};
    }
  }

  for (const volumeKey of Object.keys(sanitized.volumes ?? {})) {
    if (sanitized.volumes![volumeKey] === null) {
      sanitized.volumes![volumeKey] = { name: volumeKey };
    }
  }

  return sanitized;
}
