import { Box, BoxProps, render, Text } from "ink";
import Link from "ink-link";
import { FC } from "react";
import {
  FailedFlagValidationError,
  RequiredArgsError,
} from "@oclif/core/lib/parser/errors.js";

const color = "red";
const issueURL = "https://github.com/mittwald/cli/issues/new";
const boxProps: BoxProps = {
  width: 80,
  flexDirection: "column",
  borderColor: color,
  borderStyle: "round",
  paddingX: 1,
  rowGap: 1,
};

const GenericError: FC<{ err: Error; withStack: boolean }> = ({
  err,
  withStack,
}) => {
  return (
    <>
      <Box {...boxProps} borderColor={color}>
        <Text color={color} bold underline>
          ERROR
        </Text>
        <Text color={color}>
          An error occurred while executing this command:
        </Text>
        <Box marginX={2}>
          <Text color={color}>{err.toString()}</Text>
        </Box>
        <Text color={color}>
          If you believe this to be a bug, please open an issue at{" "}
          <Link url={issueURL}>{issueURL}</Link>.
        </Text>
      </Box>

      {withStack && "stack" in err ? (
        <Box marginX={2} marginY={1} flexDirection="column" rowGap={1}>
          <Text color={color} dimColor bold>
            ERROR STACK TRACE
          </Text>
          <Text color={color} dimColor>
            Please provide this when opening a bug report.
          </Text>
          <Text color={color} dimColor>
            {err.stack}
          </Text>
        </Box>
      ) : undefined}
    </>
  );
};

const InvalidFlagsError: FC<{ err: FailedFlagValidationError }> = ({ err }) => {
  const color = "yellow";
  return (
    <Box {...boxProps} borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND FLAGS
      </Text>
      <Text color={color}>
        The flags that you provided for this command were invalid. {err.message}
      </Text>
    </Box>
  );
};

const InvalidArgsError: FC<{ err: RequiredArgsError }> = ({ err }) => {
  const color = "yellow";
  return (
    <Box {...boxProps} borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND ARGUMENTS
      </Text>
      <Text color={color}>
        The arguments that you provided for this command were invalid.{" "}
        {err.message}
      </Text>
    </Box>
  );
};

const ErrorBox: FC<{ err: unknown }> = ({ err }) => {
  if (err instanceof FailedFlagValidationError) {
    return <InvalidFlagsError err={err} />;
  } else if (err instanceof RequiredArgsError) {
    return <InvalidArgsError err={err} />;
  } else if (err instanceof Error) {
    return <GenericError err={err} withStack />;
  } else {
    const realError = new Error((err as { toString(): string }).toString());
    return <GenericError err={realError} withStack={false} />;
  }
};

export function renderError(err: unknown) {
  render(<ErrorBox err={err} />);
}
