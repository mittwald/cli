import { describe, expect, test } from "@jest/globals";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import {
  isOwnershipNotVerifiedError,
  needsOwnershipVerification,
} from "./ownership.js";

type IngressOwnership = MittwaldAPIV2.Components.Schemas.IngressOwnership;

function ingressWith(ownership: IngressOwnership) {
  return { ownership };
}

describe("needsOwnershipVerification", () => {
  test("a domain with a TXT record that is not verified needs it", () => {
    const ingress = ingressWith({
      txtRecord: "domainVerification=cc00c136-23dc-498d-ab6a-b7e60cae92f7",
      verified: false,
    });
    expect(needsOwnershipVerification(ingress)).toBe(true);
  });

  test("a verified domain does not need it", () => {
    const ingress = ingressWith({
      txtRecord: "domainVerification=cc00c136-23dc-498d-ab6a-b7e60cae92f7",
      verified: true,
    });
    expect(needsOwnershipVerification(ingress)).toBe(false);
  });

  test("a project domain without a TXT record does not need it", () => {
    const ingress = ingressWith({ txtRecord: "", verified: false });
    expect(needsOwnershipVerification(ingress)).toBe(false);
  });
});

describe("isOwnershipNotVerifiedError", () => {
  test("a 412 response means the TXT record is missing", () => {
    const error = { isAxiosError: true, response: { status: 412 } };
    expect(isOwnershipNotVerifiedError(error)).toBe(true);
  });

  test("other response statuses are real errors", () => {
    const error = { isAxiosError: true, response: { status: 500 } };
    expect(isOwnershipNotVerifiedError(error)).toBe(false);
  });

  test("errors without a response are real errors", () => {
    expect(isOwnershipNotVerifiedError(new Error("network down"))).toBe(false);
  });
});
