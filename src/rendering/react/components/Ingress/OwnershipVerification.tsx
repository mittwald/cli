import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { FC } from "react";
import { Text } from "ink";
import { Warning, warningColor } from "../Warning.js";
import { Value } from "../Value.js";

type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;

type Props = {
  ingress: IngressIngress;
};

export const OwnershipVerification: FC<Props> = ({ ingress }) => {
  return (
    <Warning title="Domain ownership not verified" raw>
      <Text color={warningColor}>
        Create a TXT record for <Value>{ingress.hostname}</Value> with the value{" "}
        <Value>{ingress.ownership.txtRecord}</Value>, then run{" "}
        <Value>mw domain virtualhost verify {ingress.id}</Value>. The virtual
        host gets its IP addresses once its domain is verified.
      </Text>
    </Warning>
  );
};
