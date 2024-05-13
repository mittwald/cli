import debug from "debug";
import { AxiosInstance } from "@mittwald/api-client-commons";

/**
 * Configure logging for Axios requests and responses using the `debug` module.
 *
 * Run the CLI with `DEBUG=mw:api:client:*` to see the logs. Keep in mind that
 * this will also log sensitive information in request bodies or headers.
 */
export function configureAxiosLogging(axios: AxiosInstance) {
  const baseDebugger = debug("mw:api:client");
  const reqDebugger = baseDebugger.extend("request");
  const resDebugger = baseDebugger.extend("response");

  axios.interceptors.request.use((config) => {
    reqDebugger(
      "%s %s requested with %O",
      config.method?.toUpperCase(),
      config.url,
      config.data,
    );
    return config;
  });

  axios.interceptors.response.use((response) => {
    resDebugger(
      "%s %s responded with %o %O",
      response.config.method?.toUpperCase(),
      response.config.url,
      response.status + " " + response.statusText,
      response.data,
    );
    return response;
  });
}
