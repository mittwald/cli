import type { MittwaldAPIV2 } from "@mittwald/api-client";

type ContainerServiceDeclareRequest =
  MittwaldAPIV2.Components.Schemas.ContainerServiceDeclareRequest;

type StackRequest =
  MittwaldAPIV2.Paths.V2StacksStackId.Put.Parameters.RequestBody;

type ServiceWithEnvironment = ContainerServiceDeclareRequest & {
  environment?: Record<string, string>;
};

/**
 * This function is needed to work around the mStudios supposedly docker-compose
 * compatible container stack API.
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

    // mStudio requires "command" to be a string[]; in a docker-compose file, it
    // can also be a regular string.
    if (typeof (service.command as string | string[]) === "string") {
      service.command = [service.command as any as string];
    }

    // descriptions are required for mStudio containers; docker compose has no
    // equivalent field.
    if (!service.description) {
      service.description = serviceKey;
    }

    // mStudio calls it "envs", docker compose calls it "environment" 🫠
    const serviceWithEnvironment = service as ServiceWithEnvironment;
    if (serviceWithEnvironment.environment) {
      service.envs = serviceWithEnvironment.environment;
      delete serviceWithEnvironment.environment;
    }
    if (!service.envs) {
      service.envs = {};
    }
  }

  // For mStudio, volume definitions must be empty objects, null is apparently
  // not allowed.
  for (const volumeKey of Object.keys(sanitized.volumes ?? {})) {
    if (sanitized.volumes![volumeKey] === null) {
      sanitized.volumes![volumeKey] = { name: volumeKey };
    }
  }

  return sanitized;
}
