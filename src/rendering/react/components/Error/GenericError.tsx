import { Box, Text } from "ink";
import { defaultErrorBoxProps, defaultErrorColor, issueURL } from "./common.js";
import ErrorStack from "./ErrorStack.js";

interface GenericErrorProps {
  err: Error;
  withStack: boolean;
  withIssue?: boolean;
  title?: string;
}

export default function GenericError({
  err,
  withStack,
  withIssue = true,
  title = "Error",
}: GenericErrorProps) {
  return (
    <>
      <Box {...defaultErrorBoxProps} borderColor={defaultErrorColor}>
        <Text color={defaultErrorColor} bold underline>
          {title.toUpperCase()}
        </Text>
        <Text color={defaultErrorColor}>
          An error occurred while executing this command:
        </Text>
        <Box marginX={2}>
          <Text color={defaultErrorColor}>{err.toString()}</Text>
        </Box>
        {withIssue ? (
          <Text color={defaultErrorColor}>
            If you believe this to be a bug, please open an issue at {issueURL}.
          </Text>
        ) : undefined}
      </Box>

      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </>
  );
}
