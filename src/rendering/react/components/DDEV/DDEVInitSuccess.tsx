import { defaultSuccessColor, Success } from "../Success.js";
import { Box, Text } from "ink";
import React, { ReactNode } from "react";

function DDEVCommand({
  command,
  text,
  dangerous,
}: {
  command: string[];
  text: ReactNode;
  dangerous?: boolean;
}) {
  return (
    <>
      <Box>
        <Text color="yellow">{command.join(" ")}</Text>
        {dangerous ? (
          <Text color="red" bold>
            {" "}
            (DANGEROUS!)
          </Text>
        ) : undefined}
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
        command={["ddev", "start"]}
        text="Start and initialize all project containers"
      />
      <DDEVCommand
        command={["ddev", "pull", "mittwald"]}
        text="Download the latest database and files from the mittwald application linked to this DDEV project"
      />
      <DDEVCommand
        command={["ddev", "push", "mittwald"]}
        text="Upload the latest database and files to the mittwald application linked to this DDEV project"
        dangerous
      />
      <Box marginTop={1}>
        <Text color={defaultSuccessColor}>
          You can also use the <Text color="yellow">mw ddev init</Text> command
          repeatedly to continuously update your DDEV configuration.
        </Text>
      </Box>
    </Success>
  );
}
