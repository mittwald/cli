import { MittwaldAPIV2 } from "@mittwald/api-client";
import { FC } from "react";
import { Warning, warningColor } from "../Warning.js";
import { ListItem } from "../ListItem.js";
import { Value } from "../Value.js";
import IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;
import { Box, Text } from "ink";

type Props = {
  ingress: IngressIngress;
};

export const DnsValidationErrors: FC<Props> = ({ ingress }) => {
  return (
    <Warning raw>
      <Box marginY={1}>
        <Text color={warningColor}>
          Your virtual host was created, but there were some issues with your
          DNS configuration that require your attention:
        </Text>
      </Box>
      {ingress.dnsValidationErrors.map((error, idx) => {
        switch (error) {
          case "ERROR_NO_A_RECORD":
            return (
              <ListItem key={idx}>
                <Text color={warningColor}>
                  No A record for the hostname {ingress.hostname} was found;
                  please create one and point it to the following IP addresses:{" "}
                  {ingress.ips.v4.join(", ")}
                </Text>
              </ListItem>
            );
          case "ERROR_QUAD_A":
            return (
              <ListItem key={idx}>
                <Text color={warningColor}>
                  We found a AAA record for {ingress.hostname}; please note that
                  we do not support IPv6 at the moment; please create a regular
                  A record and point it to the following IP addresses:{" "}
                  {ingress.ips.v4.join(", ")}
                </Text>
              </ListItem>
            );
          default:
            return (
              <ListItem key={idx}>
                <Text color={warningColor}>
                  An unspecified error in your DNS configuration was found; if
                  unsure, please contact our customer support (easiest by using
                  the <Value>mw conversation create</Value> command)
                </Text>
              </ListItem>
            );
        }
      })}
    </Warning>
  );
};
