import { Box } from "ink";
import ErrorText from "./ErrorText.js";

export default function ErrorStack({ err }: { err: Error }) {
  return (
    <Box marginX={2} marginY={1} flexDirection="column" rowGap={1}>
      <ErrorText dimColor bold>
        ERROR STACK TRACE
      </ErrorText>
      <ErrorText dimColor>
        Please provide this when opening a bug report.
      </ErrorText>
      <ErrorText dimColor>{err.stack}</ErrorText>
    </Box>
  );
}
