import { OclifError, PrettyPrintableError } from "@oclif/core/interfaces";
import type {
  ApiClientError,
  AxiosResponse,
} from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { renderError } from "../../rendering/react/error.js";
import { isAxiosError, isExitError } from "./guards.js";

type CommonsValidationErrors =
  MittwaldAPIV2.Components.Schemas.CommonsValidationErrors;

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

export function isValidationError(
  err: unknown,
): err is ApiClientError<CommonsValidationErrors> & {
  response: AxiosResponse<CommonsValidationErrors>;
} {
  return (
    isAxiosError(err) &&
    (err.response?.data as { type?: unknown } | undefined)?.type ===
      "ValidationError"
  );
}
