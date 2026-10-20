import type { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { isAxiosError } from "@mittwald/api-client-commons";
import assertSuccess from "../../../apiutil/assert_success.js";

type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;

/**
 * Whether the domain of a virtual host still has to be verified by a TXT
 * record. Such a virtual host gets no IP addresses until it is verified; the
 * project's own domains need no TXT record and are not verified either.
 */
export function needsOwnershipVerification(
  ingress: Pick<IngressIngress, "ownership">,
): boolean {
  return !ingress.ownership.verified && !!ingress.ownership.txtRecord;
}

/**
 * Whether an error of the verify-ownership call means that mStudio found no TXT
 * record with the expected value. It answers 412 in that case, and the API
 * client throws on non-2xx responses (see api_retry.ts).
 */
export function isOwnershipNotVerifiedError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 412;
}

/**
 * Asks mStudio to check the TXT record of a virtual host's domain. The check is
 * synchronous: resolves to false when the record is missing, and rethrows any
 * other error.
 */
export async function verifyOwnership(
  apiClient: MittwaldAPIV2Client,
  ingressId: string,
): Promise<boolean> {
  try {
    const response = await apiClient.domain.ingressIngressVerifyOwnership({
      ingressId,
    });
    assertSuccess(response);
    return true;
  } catch (e) {
    if (isOwnershipNotVerifiedError(e)) {
      return false;
    }
    throw e;
  }
}
