import { Box } from "ink";
import { defaultErrorBoxProps, issueURL } from "./common.js";
import ErrorStack from "./ErrorStack.js";
import ErrorText from "./ErrorText.js";

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
      <Box {...defaultErrorBoxProps}>
        <ErrorText bold underline>
          {title.toUpperCase()}
        </ErrorText>
        <ErrorText>An error occurred while executing this command:</ErrorText>
        <Box marginX={2}>
          <ErrorText>{err.toString()}</ErrorText>
        </Box>
        {withIssue ? (
          <ErrorText>
            If you believe this to be a bug, please open an issue at {issueURL}.
          </ErrorText>
        ) : undefined}
      </Box>

      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </>
  );
}
