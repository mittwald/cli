import React, { FC } from "react";
import { Box, BoxProps, Text } from "ink";
import { Value } from "../Value.js";
import { ContainerManagementCommands } from "./ContainerManagementCommands.js";

interface NoPortsUsageHintsProps {
  containerName: string;
  boxProps: BoxProps;
}

const infoColor = "blueBright";

/**
 * NoPortsUsageHints displays usage instructions for containers that don't
 * expose any ports. It shows management commands for SSH, logs, and exec.
 */
export const NoPortsUsageHints: FC<NoPortsUsageHintsProps> = ({
  containerName,
  boxProps,
}) => {
  return (
    <Box {...boxProps} flexDirection="column">
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
};