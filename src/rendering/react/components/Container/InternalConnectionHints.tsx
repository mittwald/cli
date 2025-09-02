import React, { FC, Fragment } from "react";
import { Box, Text } from "ink";
import { Value } from "../Value.js";
import { CommandHint } from "./CommandHint.js";
import { ParsedPort } from "./types.js";

interface InternalConnectionHintsProps {
  ports: ParsedPort[];
  containerName: string;
}

const infoColor = "blueBright";

/**
 * InternalConnectionHints displays instructions for connecting to the container
 * from within the hosting environment using the service name as hostname.
 */
export const InternalConnectionHints: FC<InternalConnectionHintsProps> = ({
  ports,
  containerName,
}) => {
  return (
    <>
      <Text bold color={infoColor}>
        🏠 Connect from within hosting environment:
      </Text>

      <Box marginLeft={2} marginBottom={1}>
        <Text wrap="wrap">
          Access container from other services using{" "}
          {ports.map((port, idx) => (
            <Fragment key={`internal-${idx}`}>
              <Value>
                {containerName}:{port.port}
              </Value>
              {idx === ports.length - 1 ? " " : " or "}
            </Fragment>
          ))}
          as the hostname and port
        </Text>
      </Box>
    </>
  );
};
