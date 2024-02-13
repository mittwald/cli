import { defaultSuccessColor, Success } from "../Success.js";
import { Box, Text } from "ink";
import React from "react";

function DDEVCommand({ command, text }: { command: string; text: string }) {
  return (
    <>
      <Box>
        <Text color="yellow">{command}</Text>
      </Box>
      <Box marginLeft={2}>
        <Text wrap="wrap">{text}</Text>
      </Box>
    </>
  );
}

export function DDEVInitSuccess() {
  return (
    <Success innerText={false}>
      <Box marginBottom={1}>
        <Text color={defaultSuccessColor}>
          DDEV project successfully initialized! 🚀
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={defaultSuccessColor}>
          You can now use the following commands to get started with your DDEV
          project:
        </Text>
      </Box>
      <DDEVCommand
        command="ddev start"
        text="Start and initialize all project containers"
      />
      <DDEVCommand
        command="ddev pull mittwald"
        text="Download the latest database and files from the mittwald application linked to this DDEV project"
      />
    </Success>
  );
}
