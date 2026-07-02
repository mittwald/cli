import { describe, expect, it } from "@jest/globals";
import { AxiosError, AxiosHeaders } from "axios";
import { mapUninstallError } from "./uninstall.js";

function axiosErrorWithStatus(status: number): AxiosError {
  const headers = new AxiosHeaders();
  const config = { headers };
  return new AxiosError(
    `Request failed with status code ${status}`,
    "ERR_BAD_RESPONSE",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config as any,
    {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { status, data: {}, statusText: "", headers, config } as any,
  );
}

describe("mapUninstallError", () => {
  it("maps an HTTP 412 to a linked-primary-database hint", () => {
    const original = axiosErrorWithStatus(412);
    const mapped = mapUninstallError(original);

    expect(mapped).toBeInstanceOf(Error);
    expect((mapped as Error).message).toContain("cannot uninstall");
    expect((mapped as Error).message).toContain("primary database");
    // The original error is preserved as the cause and not swallowed.
    expect((mapped as Error).cause).toBe(original);
  });

  it("passes through other Axios errors unchanged", () => {
    const original = axiosErrorWithStatus(409);
    const mapped = mapUninstallError(original);

    expect(mapped).toBe(original);
  });

  it("passes through non-Axios errors unchanged", () => {
    const original = new Error("something else");
    const mapped = mapUninstallError(original);

    expect(mapped).toBe(original);
  });
});
