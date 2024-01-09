import { Response, ApiClientError } from "@mittwald/api-client-commons";

export function assertSuccess<T extends Response>(response: T): void {
  if (response.status >= 300) {
    throw ApiClientError.fromResponse(
      `Unexpected response status (expected <300, got: ${response.status})`,
      response,
    );
  }
}

export default assertSuccess;
