import React, { FC } from "react";
import { Box, Static, Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import useDefaultBoxStyles from "../../styles/useDefaultBoxStyles.js";
import { ContainerManagementCommands } from "./ContainerManagementCommands.js";
import { NoPortsUsageHints } from "./NoPortsUsageHints.js";
import { PortConnectionHints } from "./PortConnectionHints.js";
import { ParsedPort } from "./types.js";

type ContainerServiceResponse =
  MittwaldAPIV2.Components.Schemas.ContainerServiceResponse;

interface ContainerUsageHintsProps {
  service: ContainerServiceResponse;
}

const infoColor = "blueBright";

const parsePort = (portString: string): ParsedPort => {
  const [port, protocol] = portString.split("/");
  return { port, protocol };
};

/**
 * ContainerUsageHints displays comprehensive usage instructions for containers,
 * adapting the content based on whether the container exposes ports or not.
 */
const ContainerUsageHints: FC<ContainerUsageHintsProps> = ({ service }) => {
  const defaultBoxStyles = useDefaultBoxStyles();
  const rawPorts = service.deployedState?.ports || [];
  const ports = rawPorts.map(parsePort);
  const containerId = service.id;
  const containerName = service.serviceName;

  const boxProps = {
    ...defaultBoxStyles,
    borderColor: infoColor,
    marginLeft: 2,
  };

  // Handle containers without exposed ports
  if (ports.length === 0) {
    return (
      <NoPortsUsageHints boxProps={boxProps} containerName={containerName} />
    );
  }

  // Handle containers with exposed ports
  return (
    <Box {...boxProps} flexDirection="column">
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
        <PortConnectionHints
          ports={ports}
          containerId={containerId}
          containerName={containerName}
        />

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
