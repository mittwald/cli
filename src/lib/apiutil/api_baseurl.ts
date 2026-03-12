import { AxiosInstance } from "@mittwald/api-client-commons";

export function configureAxiosBaseURL(axios: AxiosInstance, baseURL: string) {
  const trimmedBaseURL = baseURL.trim();

  if (!trimmedBaseURL) {
    throw new Error("MITTWALD_API_BASE_URL is empty or contains only whitespace. Please provide a valid absolute URL.");
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedBaseURL);
  } catch {
    throw new Error(
      `MITTWALD_API_BASE_URL="${trimmedBaseURL}" is not a valid absolute URL. Please provide a value like "https://api.example.com".`,
    );
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error(
      `MITTWALD_API_BASE_URL="${trimmedBaseURL}" must use http or https scheme. Received protocol "${parsedUrl.protocol}".`,
    );
  }

  axios.defaults.baseURL = parsedUrl.toString();
}
