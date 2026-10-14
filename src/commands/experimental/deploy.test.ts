import { describe, expect, it } from "@jest/globals";
import { resolveDeployStackIds } from "./deploy.js";

describe("resolveDeployStackIds", () => {
  it("uses the shared stack for both services by default", () => {
    expect(resolveDeployStackIds("shared-stack", undefined, undefined)).toEqual(
      {
        registryStackId: "shared-stack",
        applicationStackId: "shared-stack",
      },
    );
  });

  it("allows registry and application services to use separate stacks", () => {
    expect(
      resolveDeployStackIds(undefined, "registry-stack", "application-stack"),
    ).toEqual({
      registryStackId: "registry-stack",
      applicationStackId: "application-stack",
    });
  });

  it("uses a role-specific stack as an override of the shared stack", () => {
    expect(
      resolveDeployStackIds("shared-stack", "registry-stack", undefined),
    ).toEqual({
      registryStackId: "registry-stack",
      applicationStackId: "shared-stack",
    });
  });

  it("requires a shared stack when a role-specific stack is missing", () => {
    expect(() =>
      resolveDeployStackIds(undefined, "registry-stack", undefined),
    ).toThrow(
      "Provide --stack-id or both --registry-stack-id and --application-stack-id.",
    );
  });
});
