import {
  OclifError,
  PrettyPrintableError,
} from "@oclif/core/lib/interfaces/index.js";
import { ApiClientError, AxiosResponse } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ExitError } from "@oclif/core/lib/errors/index.js";
import { renderError } from "../../rendering/react/error.js";

type CommonsValidationErrors =
  MittwaldAPIV2.Components.Schemas.CommonsValidationErrors;

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

  if (error instanceof ExitError) {
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
    err instanceof ApiClientError &&
    err.response?.data?.type === "ValidationError"
  );
}
