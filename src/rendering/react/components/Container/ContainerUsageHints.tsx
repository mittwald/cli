import React, { FC, ReactNode } from "react";
import { Box, Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import useDefaultBoxStyles from "../../styles/useDefaultBoxStyles.js";
import { ContainerManagementCommands } from "./ContainerManagementCommands.js";
import { CommandHint } from "./CommandHint.js";

type ContainerServiceResponse =
  MittwaldAPIV2.Components.Schemas.ContainerServiceResponse;

interface ContainerUsageHintsProps {
  service: ContainerServiceResponse;
}

interface ParsedPort {
  port: string;
  protocol: string;
}

const infoColor = "blueBright";

const parsePort = (portString: string): ParsedPort => {
  const [port, protocol] = portString.split("/");
  return { port, protocol };
};

const ContainerUsageHints: FC<ContainerUsageHintsProps> = ({ service }) => {
  const defaultBoxStyles = useDefaultBoxStyles();
  const rawPorts = service.deployedState?.ports || [];
  const ports = rawPorts.map(parsePort);
  const containerId = service.id;
  const containerName = service.serviceName;

  if (ports.length === 0) {
    return (
      <Box {...defaultBoxStyles} borderColor={infoColor} flexDirection="column">
        <Text bold underline color={infoColor}>
          USAGE HINTS
        </Text>
        <Text color={infoColor}>
          Container <Value>{containerName}</Value> is now running! 🐳
        </Text>
        <Box marginTop={1}>
          <Text>
            Your container doesn't expose any ports, but you can still interact
            with it:
          </Text>
        </Box>
        <Box marginTop={1} flexDirection="column">
          <ContainerManagementCommands containerIdentifier={containerName} />
        </Box>
      </Box>
    );
  }

  return (
    <Box {...defaultBoxStyles} borderColor={infoColor} flexDirection="column">
      <Text bold underline color={infoColor}>
        USAGE HINTS
      </Text>
      <Text color={infoColor}>
        Container <Value>{containerName}</Value> is now running and listening on{" "}
        {ports.length === 1 ? "port" : "ports"}:{" "}
        {ports.map((port, index) => (
          <Value key={index}>
            {port.port}/{port.protocol}
            {index < ports.length - 1 ? ", " : ""}
          </Value>
        ))}
        ! 🐳
      </Text>

      <Box marginTop={1}>
        <Text>Connect to your container using one of these methods:</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
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

        <Box marginTop={1}>
          <Text bold color={infoColor}>
            🔗 Port Forward for Local Development:
          </Text>
        </Box>
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
                Forward container port <Value>{port.port}</Value> to a local
                port (e.g.,{" "}
                <Value>
                  {port.port}:{port.port}
                </Value>{" "}
                makes it accessible at{" "}
                <Value>http://localhost:{port.port}</Value>)
              </>
            }
          />
        ))}

        <ContainerManagementCommands containerIdentifier={containerName} />

        <Box marginTop={1}>
          <Text color={infoColor}>
            💡 Tip: Use <Value>mw container list</Value> to see all your
            containers and their current status.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ContainerUsageHints;
