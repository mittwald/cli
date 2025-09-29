import { AxiosInstance } from "@mittwald/api-client-commons";
import debug from "debug";
import axiosRetry from "axios-retry";

const d = debug("mw:api-retry");

export function configureAxiosRetry(axios: AxiosInstance) {
  let shouldRetryAccessDenied = false;

  axios.interceptors.request.use((config) => {
    return {
      ...config,
      validateStatus: (status) => status < 300,
    };
  });

  axios.interceptors.request.use((config) => {
    if (config.method?.toLowerCase() === "post") {
      shouldRetryAccessDenied = true;
    }
    return config;
  });

  axiosRetry(axios, {
    retries: 10,
    retryDelay: axiosRetry.exponentialDelay,
    onRetry(count, error, config) {
      if (error.response?.status === 412 && config.headers !== undefined) {
        delete config.headers["if-event-reached"];
      }
      d("retrying request after %d attempts; error: %o", count, error.message);
    },
    retryCondition(error) {
      if (error.code === "ERR_FR_TOO_MANY_REDIRECTS") {
        return false;
      }

      if (axiosRetry.isNetworkOrIdempotentRequestError(error)) {
        return true;
      }

      const isSafeRequest = error.config?.method?.toLowerCase() === "get";
      const isConditionalRequest =
        !!error.config?.headers?.["if-event-reached"];
      const isPreconditionFailed = error.response?.status === 412;
      const isAccessDenied = error.response?.status === 403;

      if (isPreconditionFailed && isConditionalRequest) {
        return true;
      }

      return isSafeRequest && isAccessDenied && shouldRetryAccessDenied;
    },
  });
}
