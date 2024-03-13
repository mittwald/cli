import { Box, Text } from "ink";
import { defaultErrorColor } from "./common.js";

export default function ErrorStack({ err }: { err: Error }) {
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
}
