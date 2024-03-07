import { AxiosHeaders, AxiosInstance } from "@mittwald/api-client-commons";
import debug from "debug";

const d = debug("mw:api-consistency");

export function configureConsistencyHandling(axios: AxiosInstance) {
  let lastEventId: string | undefined = undefined;

  axios.interceptors.request.use((config) => {
    if (lastEventId !== undefined) {
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
      d(
        "setting last event id to %o after mutating request",
        headers.get("etag"),
      );
      lastEventId = headers.get("etag") as string;
    }
    return response;
  });
}
