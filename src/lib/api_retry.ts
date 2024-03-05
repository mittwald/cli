import { Response } from "@mittwald/api-client-commons";
import debug from "debug";

const d = debug("mw:api-retry");

type BackoffFunction = (attempt: number) => number;

type RetryOptions = {
  attempts: number;
  backoff: BackoffFunction;
};

/**
 * Contains a collection of backoff strategies for use with
 * `withAttemptsToSuccess`.
 */
export const backoffStrategies = {
  exponential: (initial: number, base: number) => (attempt: number) =>
    initial * base ** attempt,
  linear: (step: number) => (attempt: number) => step * attempt,
  max: (inner: BackoffFunction, max: number) => (attempt: number) =>
    Math.min(inner(attempt), max),
};

/**
 * Wraps an API call function and retries it until it returns a successful
 * response.
 *
 * On non-successful responses, it waits for a (configurable) backoff time
 * before retrying.
 *
 * Usage:
 *
 *     const getMysqlDatabase = withAttemptsToSuccess(
 *       this.apiClient.database.getMysqlDatabase,
 *     );
 *     return (await getWithRetry({ mysqlDatabaseId })).data;
 */
export function withAttemptsToSuccess<TReq, TRes extends Response>(
  fn: (req: TReq) => Promise<TRes>,
  {
    attempts = 50,
    backoff = backoffStrategies.max(
      backoffStrategies.exponential(100, 1.2),
      2000,
    ),
  }: Partial<RetryOptions> = {},
) {
  return async function (req: TReq) {
    let response: TRes | undefined;
    for (let i = 0; i < attempts; i++) {
      response = await fn(req);
      const waitFor = backoff(i);

      if (isStatus(response, 200)) {
        return response;
      }

      d("received status %d, waiting for %d ms", response.status, waitFor);

      await new Promise((resolve) => setTimeout(resolve, backoff(i)));
    }

    throw new Error(
      `received status ${response?.status} after ${attempts} attempts`,
    );
  };
}

function isStatus<T extends Response, S extends T["status"]>(
  response: T,
  expectedStatus: S,
): response is T & {
  status: S;
} {
  return response.status === expectedStatus;
}
