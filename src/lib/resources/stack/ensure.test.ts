import { describe, expect, it } from "@jest/globals";
import { type MittwaldAPIV2 } from "@mittwald/api-client";
import { selectStackForService } from "./ensure.js";

type Stack = MittwaldAPIV2.Components.Schemas.ContainerStackResponse;
type Service = MittwaldAPIV2.Components.Schemas.ContainerServiceResponse;

function stack(id: string, description: string, serviceNames: string[]) {
  return {
    id,
    description,
    services: serviceNames.map((serviceName) => ({ serviceName }) as Service),
  } as Stack;
}

describe("selectStackForService", () => {
  it("selects the stack that already contains the service", () => {
    const stacks = [
      stack("default", "default", ["project-registry", "app"]),
      stack("registry", "project registry", []),
    ];

    expect(
      selectStackForService(stacks, "project-registry", "project registry")?.id,
    ).toBe("default");
  });

  it("falls back to a stack with a matching description", () => {
    const stacks = [
      stack("default", "default", ["other"]),
      stack("registry", "project registry", []),
    ];

    expect(
      selectStackForService(stacks, "project-registry", "project registry")?.id,
    ).toBe("registry");
  });

  it("returns undefined if no stack matches", () => {
    const stacks = [stack("default", "default", ["other"])];

    expect(
      selectStackForService(stacks, "project-registry", "project registry"),
    ).toBeUndefined();
  });
});
