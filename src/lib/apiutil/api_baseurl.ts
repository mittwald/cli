import { AxiosInstance } from "@mittwald/api-client-commons";

export function configureAxiosBaseURL(axios: AxiosInstance, baseURL: string) {
  axios.defaults.baseURL = baseURL;
}