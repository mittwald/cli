import { describe, expect, it } from "@jest/globals";
import { mapUninstallError } from "./uninstall.js";

function apiErrorLike(options: {
  message?: string;
  status: number;
  type?: string;
}) {
  return {
    response: {
      data: {
        message: options.message,
        type: options.type,
      },
      status: options.status,
    },
  };
}

describe("mapUninstallError", () => {
  it("maps matching HTTP 412 primary-database preconditions", () => {
    const original = apiErrorLike({
      status: 412,
      type: "PreconditionFailed",
      message: "App has a linked primary database",
    });
    const mapped = mapUninstallError(original);

    expect(mapped).toBeInstanceOf(Error);
    expect((mapped as Error).message).toContain("cannot uninstall");
    expect((mapped as Error).message).toContain("primary database");
    // The original error is preserved as the cause.
    expect((mapped as Error).cause).toBe(original);
  });

  it("passes through unrelated HTTP 412 errors unchanged", () => {
    const original = apiErrorLike({
      status: 412,
      type: "PreconditionFailed",
      message: "Some other precondition failed",
    });
    const mapped = mapUninstallError(original);

    expect(mapped).toBe(original);
  });

  it("passes through non-412 API errors unchanged", () => {
    const original = apiErrorLike({ status: 409, type: "Conflict" });
    const mapped = mapUninstallError(original);

    expect(mapped).toBe(original);
  });

  it("passes through unrelated errors unchanged", () => {
    const original = new Error("something else");
    const mapped = mapUninstallError(original);

    expect(mapped).toBe(original);
  });
});
