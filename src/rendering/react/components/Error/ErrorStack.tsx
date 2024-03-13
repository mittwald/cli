import { Box, Text } from "ink";
import { FC } from "react";
import { defaultErrorColor } from "./common.js";

export const ErrorStack: FC<{ err: Error }> = ({ err }) => {
  return (
    <Box marginX={2} marginY={1} flexDirection="column" rowGap={1}>
      <Text color={defaultErrorColor} dimColor bold>
        ERROR STACK TRACE
      </Text>
      <Text color={defaultErrorColor} dimColor>
        Please provide this when opening a bug report.
      </Text>
      <Text color={defaultErrorColor} dimColor>
        {err.stack}
      </Text>
    </Box>
  );
};
