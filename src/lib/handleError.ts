import oclif from "@oclif/core";
import {
  OclifError,
  PrettyPrintableError,
} from "@oclif/core/lib/interfaces/index.js";
import { ApiClientError } from "@mittwald/api-client-commons";

export const handleError = (
  error: Error &
    Partial<PrettyPrintableError> &
    Partial<OclifError> & {
      skipOclifErrorHandling?: boolean;
    },
): void => {
  if (error instanceof ApiClientError) {
    const responseJson = JSON.stringify(error.response?.data, undefined, 2);

    const errorMessage = `\
${error.message}

Response:
─────────
${responseJson}`;

    error = new Error(errorMessage, {
      cause: error,
    });
  }

  oclif.Errors.handle(error);
};
