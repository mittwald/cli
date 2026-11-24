import { OclifError, PrettyPrintableError } from "@oclif/core/interfaces";
import { renderError } from "../../rendering/react/error.js";
import { isExitError, isValidationError } from "./guards.js";

// noinspection JSUnusedGlobalSymbols
export default function handleError(
  error: Error &
    Partial<PrettyPrintableError> &
    Partial<OclifError> & {
      skipOclifErrorHandling?: boolean;
    },
): void {
  if (!isUnexpectedError(error)) {
    process.exit(1);
  }

  if (isExitError(error)) {
    process.exit(error.oclif.exit);
  }

  renderError(error);
  process.exit(1);
}

function isUnexpectedError(err: unknown): boolean {
  return !isValidationError(err);
}
