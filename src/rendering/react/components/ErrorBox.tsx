import { Box, Text } from "ink";
import { FC } from "react";
import {
  FailedFlagValidationError,
  RequiredArgsError,
} from "@oclif/core/lib/parser/errors.js";
import { ApiClientError } from "@mittwald/api-client-commons";
import InteractiveInputRequiredError from "../../../lib/error/InteractiveInputRequiredError.js";
import UnexpectedShortIDPassedError from "../../../lib/error/UnexpectedShortIDPassedError.js";
import { defaultErrorBoxProps } from "./Error/common.js";
import { GenericError } from "./Error/GenericError.js";
import { ApiError } from "./Error/APIError.js";

const InvalidFlagsError: FC<{ err: FailedFlagValidationError }> = ({ err }) => {
  const color = "yellow";
  return (
    <Box {...defaultErrorBoxProps} borderColor={color}>
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
    <Box {...defaultErrorBoxProps} borderColor={color}>
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

/**
 * Render an error to the terminal.
 *
 * @class
 * @param err The error to render. May be anything, although different errors
 *   will be rendered differently.
 */
export const ErrorBox: FC<{ err: unknown }> = ({ err }) => {
  if (err instanceof FailedFlagValidationError) {
    return <InvalidFlagsError err={err} />;
  } else if (err instanceof RequiredArgsError) {
    return <InvalidArgsError err={err} />;
  } else if (err instanceof ApiClientError) {
    return <ApiError err={err} withStack withHTTPMessages="body" />;
  } else if (err instanceof InteractiveInputRequiredError) {
    return (
      <GenericError
        err={err}
        withStack={false}
        withIssue={false}
        title="Input required"
      />
    );
  } else if (err instanceof Error) {
    return <GenericError err={err} withStack />;
  }

  const realError = new Error((err as { toString(): string }).toString());
  return <GenericError err={realError} withStack={false} />;
};
