import oclif from "@oclif/core";
import { OclifError, PrettyPrintableError } from "@oclif/core/interfaces";
import { ApiClientError, AxiosResponse } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ExitError } from "@oclif/core/errors";
import { renderError } from "../../rendering/react/error.js";

type CommonsValidationErrors =
  MittwaldAPIV2.Components.Schemas.CommonsValidationErrors;

// noinspection JSUnusedGlobalSymbols
export default async function handleError(
  error: Error &
    Partial<PrettyPrintableError> &
    Partial<OclifError> & {
      skipOclifErrorHandling?: boolean;
    },
): Promise<void> {
  if (!isUnexpectedError(error)) {
    await oclif.flush();
    process.exit(1);
  }

  if (error instanceof ExitError) {
    await oclif.flush();
    process.exit(error.oclif.exit);
  }

  await renderError(error);
  await oclif.flush();
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
