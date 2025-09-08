import React, { FC, ReactNode } from "react";
import { Box, Text } from "ink";

export interface CommandHintProps {
  command: string[];
  description: ReactNode;
}

/**
 * CommandHint is a functional React component that renders a command hint
 * display. It presents a styled command and its corresponding description.
 *
 * @param command An array of strings representing the command to be displayed.
 * @param description A textual description of the command.
 * @returns A JSX element displaying the command and description.
 */
export const CommandHint: FC<CommandHintProps> = ({ command, description }) => {
  return (
    <>
      <Box>
        <Text color="yellow">{command.join(" ")}</Text>
      </Box>
      <Box marginLeft={2} marginBottom={1}>
        <Text wrap="wrap">{description}</Text>
      </Box>
    </>
  );
};
