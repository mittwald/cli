import { MittwaldAPIV2 } from "@mittwald/api-client";
import { FC } from "react";
import { Warning, warningColor } from "../Warning.js";
import { Value } from "../Value.js";
import { Box, Text } from "ink";
import DomainDomainOwnership = MittwaldAPIV2.Components.Schemas.DomainDomainOwnership;

type Props = {
  ownership: DomainDomainOwnership;
};

export const DomainOwnership: FC<Props> = ({ ownership }) => {
  return (
    <Warning raw>
      <Box marginY={1} flexDirection="column">
        <Text color={warningColor}>
          Your virtual host was created, but you need to verify your ownership
          of the domain <Value>{ownership.domain}</Value> before proceeding. To
          do this, create a TXT record with the following content:
        </Text>
        <Box marginY={1}>
          <Text>
            <Value> {ownership.txtRecord}</Value>
          </Text>
        </Box>
        <Text color={warningColor}>
          Once you have created the record, use the{" "}
          <Value>mw domain ownership verify</Value> command to verify your
          ownership.
        </Text>
      </Box>
    </Warning>
  );
};
