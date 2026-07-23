import { describe, expect, it } from "@jest/globals";
import { getAPIErrorDetails, matchesAPIError } from "./apiError.js";

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

describe("getAPIErrorDetails", () => {
  it("extracts status and body from API-like errors", () => {
    const details = getAPIErrorDetails(
      apiErrorLike({
        status: 412,
        type: "PreconditionFailed",
        message: "primary database is linked",
      }),
    );

    expect(details).toEqual({
      status: 412,
      body: {
        type: "PreconditionFailed",
        message: "primary database is linked",
      },
    });
  });

  it("returns null for non-API errors", () => {
    expect(getAPIErrorDetails(new Error("no response"))).toBeNull();
  });
});

describe("matchesAPIError", () => {
  it("matches by status and keywords", () => {
    const err = apiErrorLike({
      status: 412,
      type: "PreconditionFailed",
      message: "App has linked primary database",
    });

    expect(
      matchesAPIError(err, {
        status: 412,
        keywords: ["primary", "database"],
      }),
    ).toBe(true);
  });

  it("does not match when keywords are missing", () => {
    const err = apiErrorLike({
      status: 412,
      type: "PreconditionFailed",
      message: "Some other precondition failed",
    });

    expect(
      matchesAPIError(err, {
        status: 412,
        keywords: ["primary", "database"],
      }),
    ).toBe(false);
  });
});
