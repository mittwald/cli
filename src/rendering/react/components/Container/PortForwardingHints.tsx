import React, { FC } from "react";
import { Text } from "ink";
import { Value } from "../Value.js";
import { CommandHint } from "./CommandHint.js";
import { ParsedPort } from "./types.js";

interface PortForwardingHintsProps {
  ports: ParsedPort[];
  containerName: string;
}

const infoColor = "blueBright";

/**
 * PortForwardingHints displays instructions for forwarding container ports to
 * local ports for development purposes.
 */
export const PortForwardingHints: FC<PortForwardingHintsProps> = ({
  ports,
  containerName,
}) => {
  return (
    <>
      <Text bold color={infoColor}>
        🔗 Port Forward for Local Development:
      </Text>
      {ports.map((port) => (
        <CommandHint
          key={`forward-${port.port}`}
          command={[
            "mw",
            "container",
            "port-forward",
            containerName,
            `<local-port>:${port.port}`,
          ]}
          description={
            <>
              Forward container port <Value>{port.port}</Value> to a local port
              (e.g.,{" "}
              <Value>
                {port.port}:{port.port}
              </Value>{" "}
              makes it accessible at <Value>http://localhost:{port.port}</Value>
              ). This works for all TCP-based protocols.
            </>
          }
        />
      ))}
    </>
  );
};
