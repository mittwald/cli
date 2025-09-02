import React, { FC } from "react";
import { Text } from "ink";
import { Value } from "../Value.js";
import { CommandHint } from "./CommandHint.js";
import { ParsedPort } from "./types.js";

interface DomainConnectionHintsProps {
  ports: ParsedPort[];
  containerId: string;
}

const infoColor = "blueBright";

/**
 * DomainConnectionHints displays instructions for connecting a domain to
 * container ports via virtualhost creation.
 */
export const DomainConnectionHints: FC<DomainConnectionHintsProps> = ({
  ports,
  containerId,
}) => {
  return (
    <>
      <Text bold color={infoColor}>
        🌐 Connect via Domain (recommended):
      </Text>
      {ports.map((port) => (
        <CommandHint
          key={`domain-${port.port}`}
          command={[
            "mw",
            "domain",
            "virtualhost",
            "create",
            "--hostname",
            "<your-domain.com>",
            "--path-to-container",
            `/:${containerId}:${port.port}/${port.protocol}`,
          ]}
          description={
            <>
              Connect <Value>{"<your-domain.com>"}</Value> to container port{" "}
              <Value>
                {port.port}/{port.protocol}
              </Value>
              , making it accessible via HTTPS
            </>
          }
        />
      ))}
    </>
  );
};
