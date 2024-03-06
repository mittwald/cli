import { AxiosInstance } from "@mittwald/api-client-commons";
import debug from "debug";
import axiosRetry from "axios-retry";

const d = debug("mw:api-retry");

export function configureAxiosRetry(axios: AxiosInstance) {
  axios.interceptors.request.use((config) => {
    return {
      ...config,
      validateStatus: (status) => status < 300,
    };
  });

  axiosRetry(axios, {
    retries: 10,
    retryDelay: axiosRetry.exponentialDelay,
    onRetry(count, error) {
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
      const isAccessDenied = error.response?.status === 403;

      return isSafeRequest && isAccessDenied;
    },
  });
}
