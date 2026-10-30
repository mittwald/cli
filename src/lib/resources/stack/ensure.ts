import {
  assertStatus,
  type MittwaldAPIV2,
  type MittwaldAPIV2Client,
} from "@mittwald/api-client";

type Stack = MittwaldAPIV2.Components.Schemas.ContainerStackResponse;

/**
 * Selects the stack that should host a given service: the stack that already
 * contains a service with that name, or else a stack with the given
 * description.
 */
export function selectStackForService(
  stacks: Stack[],
  serviceName: string,
  description: string,
): Stack | undefined {
  return (
    stacks.find((s) =>
      s.services?.some((svc) => svc.serviceName === serviceName),
    ) ?? stacks.find((s) => s.description === description)
  );
}

/**
 * Returns the ID of the stack that should host a given service (see
 * selectStackForService), creating a new stack with the given description if
 * there is none.
 */
export async function ensureStackForService(
  apiClient: MittwaldAPIV2Client,
  projectId: string,
  serviceName: string,
  description: string,
): Promise<{ stackId: string; created: boolean }> {
  const stacks = await apiClient.container.listStacks({ projectId });
  assertStatus(stacks, 200);

  const existing = selectStackForService(stacks.data, serviceName, description);
  if (existing) {
    return { stackId: existing.id, created: false };
  }

  const created = await apiClient.container.createStack({
    projectId,
    data: { description },
  });
  assertStatus(created, 201);

  return { stackId: created.data.id, created: true };
}
