import React, { FC } from "react";
import { isAxiosError, isErrorOfClass } from "../../../lib/error/guards.js";
import InteractiveInputRequiredError from "../../../lib/error/InteractiveInputRequiredError.js";
import UnexpectedShortIDPassedError from "../../../lib/error/UnexpectedShortIDPassedError.js";
import GenericError from "./Error/GenericError.js";
import APIError from "./Error/APIError.js";
import UnexpectedShortIDPassedErrorBox from "./Error/UnexpectedShortIDPassedErrorBox.js";
import {
  MissingArgError,
  MissingFlagError,
} from "../../../lib/context/FlagSetBuilder.js";
import NoTokenFoundError from "../../../lib/error/NoTokenFoundError.js";

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
  //
  // Errors thrown by plugin commands are instances of the plugin's own copies
  // of these classes, so do not use "instanceof" here (see guards.ts).
  if (isAxiosError(err)) {
    return <APIError err={err} withStack withHTTPMessages="body" />;
  } else if (
    isErrorOfClass(err, InteractiveInputRequiredError) ||
    isErrorOfClass(err, MissingArgError) ||
    isErrorOfClass(err, MissingFlagError)
  ) {
    return (
      <GenericError
        err={err}
        withStack={false}
        withIssue={false}
        title="Input required"
      />
    );
  } else if (isErrorOfClass(err, NoTokenFoundError)) {
    return (
      <GenericError
        err={err}
        withStack={false}
        withIssue={false}
        title="Login required"
      />
    );
  } else if (isErrorOfClass(err, UnexpectedShortIDPassedError)) {
    return <UnexpectedShortIDPassedErrorBox err={err} />;
  } else if (err instanceof Error) {
    return <GenericError err={err} withStack />;
  }

  const realError = new Error((err as { toString(): string }).toString());
  return <GenericError err={realError} withStack={false} />;
};
