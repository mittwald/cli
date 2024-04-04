import { AxiosHeaders, AxiosInstance } from "@mittwald/api-client-commons";
import debug from "debug";

const d = debug("mw:api-consistency");

export function configureConsistencyHandling(axios: AxiosInstance) {
  let lastEventId: string | undefined = undefined;
  let mutatedPaths: string[] | undefined = undefined;

  axios.interceptors.request.use((config) => {
    if (
      lastEventId !== undefined &&
      mutatedPaths?.some((path) => config.url?.startsWith(path))
    ) {
      d("setting if-event-reached to %o", lastEventId);
      config.headers["if-event-reached"] = lastEventId;
    }
    return config;
  });

  axios.interceptors.response.use((response) => {
    const isMutatingRequest =
      ["post", "put", "delete", "patch"].indexOf(
        response.config?.method?.toLowerCase() ?? "",
      ) >= 0;
    const headers = response.headers as AxiosHeaders;

    if (headers.has("etag") && isMutatingRequest) {
      lastEventId = headers.get("etag") as string;

      const mutatedPath = response.config?.url;
      if (mutatedPath !== undefined) {
        mutatedPaths = [mutatedPath];
      }

      d(
        "setting last event id to %o after mutating request for path %o",
        headers["etag"],
        mutatedPath,
      );
    }
    return response;
  });
}
