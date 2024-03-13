import React, { FC } from "react";
import {
  FailedFlagValidationError,
  RequiredArgsError,
} from "@oclif/core/lib/parser/errors.js";
import { ApiClientError } from "@mittwald/api-client-commons";
import InteractiveInputRequiredError from "../../../lib/error/InteractiveInputRequiredError.js";
import UnexpectedShortIDPassedError from "../../../lib/error/UnexpectedShortIDPassedError.js";
import { GenericError } from "./Error/GenericError.js";
import { ApiError } from "./Error/APIError.js";
import { InvalidFlagsError } from "./Error/InvalidFlagsError.js";
import InvalidArgsError from "./Error/InvalidArgsError.js";

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
