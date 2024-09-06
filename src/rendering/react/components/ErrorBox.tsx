import React, { FC } from "react";
import { AxiosError } from "@mittwald/api-client-commons";
import InteractiveInputRequiredError from "../../../lib/error/InteractiveInputRequiredError.js";
import UnexpectedShortIDPassedError from "../../../lib/error/UnexpectedShortIDPassedError.js";
import GenericError from "./Error/GenericError.js";
import InvalidFlagsError from "./Error/InvalidFlagsError.js";
import InvalidArgsError from "./Error/InvalidArgsError.js";
import APIError from "./Error/APIError.js";
import UnexpectedShortIDPassedErrorBox from "./Error/UnexpectedShortIDPassedErrorBox.js";
import {
  MissingArgError,
  MissingFlagError,
} from "../../../lib/context/FlagSetBuilder.js";

/**
 * Render an error to the terminal.
 *
 * @param err The error to render. May be anything, although different errors
 *   will be rendered differently.
 */
export const ErrorBox: FC<{ err: unknown }> = ({ err }) => {
  // TODO
  // if (err instanceof FailedFlagValidationError) {
  //   return <InvalidFlagsError err={err} />;
  // } else if (err instanceof RequiredArgsError) {
  //   return <InvalidArgsError err={err} />;
  // } else if (err instanceof AxiosError) {
  if (err instanceof AxiosError) {
    return <APIError err={err} withStack withHTTPMessages="body" />;
  } else if (
    err instanceof InteractiveInputRequiredError ||
    err instanceof MissingArgError ||
    err instanceof MissingFlagError
  ) {
    return (
      <GenericError
        err={err}
        withStack={false}
        withIssue={false}
        title="Input required"
      />
    );
  } else if (err instanceof UnexpectedShortIDPassedError) {
    return <UnexpectedShortIDPassedErrorBox err={err} />;
  } else if (err instanceof Error) {
    return <GenericError err={err} withStack />;
  }

  const realError = new Error((err as { toString(): string }).toString());
  return <GenericError err={realError} withStack={false} />;
};
