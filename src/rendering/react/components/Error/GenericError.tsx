import { Box } from "ink";
import ErrorStack from "./ErrorStack.js";
import ErrorText from "./ErrorText.js";
import ErrorBox from "./ErrorBox.js";

const issueURL = "https://github.com/mittwald/cli/issues/new";

interface GenericErrorProps {
  err: Error;
  withStack: boolean;
  withIssue?: boolean;
  title?: string;
}

/**
 * Render a generic error to the terminal. This is used for errors that don't
 * have a specific rendering function.
 */
export default function GenericError({
  err,
  withStack,
  withIssue = true,
  title = "Error",
}: GenericErrorProps) {
  return (
    <Box flexDirection="column">
      <ErrorBox>
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
      </ErrorBox>

      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </Box>
  );
}
