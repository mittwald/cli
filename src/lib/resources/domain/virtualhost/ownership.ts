import type { MittwaldAPIV2 } from "@mittwald/api-client";

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
