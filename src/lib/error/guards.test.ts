import { describe, expect, it } from "@jest/globals";
import { AxiosError } from "@mittwald/api-client-commons";
import { ExitError } from "@oclif/core/errors";
import {
  isAxiosError,
  isErrorOfClass,
  isExitError,
  isValidationError,
} from "./guards.js";
import NoTokenFoundError from "./NoTokenFoundError.js";
import InteractiveInputRequiredError from "./InteractiveInputRequiredError.js";
import UnexpectedShortIDPassedError from "./UnexpectedShortIDPassedError.js";
import {
  MissingArgError,
  MissingFlagError,
} from "../context/FlagSetBuilder.js";

describe("isAxiosError", () => {
  it("matches axios errors", () => {
    expect(isAxiosError(new AxiosError("failed"))).toBe(true);
  });

  it("matches axios errors from another copy of axios", () => {
    const err = Object.assign(new Error("failed"), { isAxiosError: true });
    expect(isAxiosError(err)).toBe(true);
  });

  it("does not match other errors", () => {
    expect(isAxiosError(new Error("failed"))).toBe(false);
    expect(isAxiosError(undefined)).toBe(false);
    expect(isAxiosError("failed")).toBe(false);
  });
});

describe("isValidationError", () => {
  const apiError = (status: number, data: unknown) =>
    Object.assign(new Error("failed"), {
      isAxiosError: true,
      response: { status, data },
    });

  it("matches API errors with validation errors", () => {
    expect(
      isValidationError(
        apiError(400, { type: "ValidationError", message: "invalid" }),
      ),
    ).toBe(true);
  });

  it("does not match other API errors", () => {
    expect(isValidationError(apiError(401, { type: "Unauthenticated" }))).toBe(
      false,
    );
    expect(isValidationError(apiError(500, "Internal Server Error"))).toBe(
      false,
    );
  });

  it("does not match errors that are not API errors", () => {
    expect(
      isValidationError(
        Object.assign(new Error("failed"), {
          response: { status: 400, data: { type: "ValidationError" } },
        }),
      ),
    ).toBe(false);
  });
});

describe("isExitError", () => {
  it("matches oclif exit errors", () => {
    expect(isExitError(new ExitError(2))).toBe(true);
  });

  it("matches exit errors from another copy of oclif", () => {
    const err = Object.assign(new Error("EEXIT: 2"), {
      code: "EEXIT",
      oclif: { exit: 2 },
    });
    expect(isExitError(err)).toBe(true);
  });

  it("does not match other errors", () => {
    expect(isExitError(new Error("EEXIT: 2"))).toBe(false);
  });
});

describe("isErrorOfClass", () => {
  it("matches instances of the class", () => {
    expect(
      isErrorOfClass(new NoTokenFoundError("token"), NoTokenFoundError),
    ).toBe(true);
  });

  it("matches instances of another copy of the class", () => {
    // Simulates the same class, loaded from another copy of the CLI
    const copy = class NoTokenFoundError extends Error {
      override name = "NoTokenFoundError";
    };
    expect(isErrorOfClass(new copy(), NoTokenFoundError)).toBe(true);
  });

  it("does not match instances of other classes", () => {
    expect(isErrorOfClass(new Error("failed"), NoTokenFoundError)).toBe(false);
    expect(
      isErrorOfClass(
        new MissingArgError("project", "project-id"),
        MissingFlagError,
      ),
    ).toBe(false);
  });

  it.each([
    [NoTokenFoundError, new NoTokenFoundError("token")],
    [InteractiveInputRequiredError, new InteractiveInputRequiredError()],
    [
      UnexpectedShortIDPassedError,
      new UnexpectedShortIDPassedError("project", "p-XXXXXX"),
    ],
    [MissingArgError, new MissingArgError("project", "project-id")],
    [MissingFlagError, new MissingFlagError("project", "project-id")],
  ])("is supported by %p, which sets its name", (cls, err) => {
    expect(err.name).toBe(cls.name);
  });
});
