import {
  ApiClientError,
  AxiosResponseHeaders,
  AxiosError,
} from "@mittwald/api-client-commons";
import { Box, Text } from "ink";
import { RawAxiosResponseHeaders } from "axios";
import ErrorStack from "./ErrorStack.js";
import ErrorText from "./ErrorText.js";
import ErrorBox from "./ErrorBox.js";

function RequestHeaders({ headers }: { headers: string }) {
  const lines = headers.trim().split("\r\n");
  const requestLine = lines.shift();
  const values = lines.map((line) => line.split(": ", 2)) as [string, string][];
  const maxKeyLength = Math.max(...values.map(([key]) => key.length));

  return (
    <Box flexDirection="column">
      <Text bold underline>
        {requestLine}
      </Text>
      {values.map(([key, value]) => (
        <Box flexDirection="row" key={key}>
          <Text dimColor>{key.toLowerCase().padEnd(maxKeyLength, " ")} </Text>
          <Text bold>{key === "x-access-token" ? "[redacted]" : value}</Text>
        </Box>
      ))}
    </Box>
  );
}

function Response({
  status,
  statusText,
  body,
  headers,
}: {
  status: number;
  statusText: string;
  body: unknown;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
}) {
  const keys = Object.keys(headers);
  const maxKeyLength = Math.max(...keys.map((key) => key.length));
  return (
    <Box flexDirection="column">
      <Text bold underline key="status">
        {status} {statusText}
      </Text>
      {keys.map((key) => (
        <Box flexDirection="row" key={key}>
          <Text dimColor>{key.toLowerCase().padEnd(maxKeyLength, " ")} </Text>
          <Text bold>
            {key === "x-access-token" ? "[redacted]" : headers[key]}
          </Text>
        </Box>
      ))}
      <Box marginTop={1} key="body">
        <Text>{JSON.stringify(body, undefined, 2)}</Text>
      </Box>
    </Box>
  );
}

function HttpMessages({ err }: { err: ApiClientError }) {
  const response = err.response ? (
    <Response
      status={err.response.status!}
      statusText={err.response.statusText}
      body={err.response.data}
      headers={err.response.headers}
    />
  ) : (
    <Text>no response received</Text>
  );

  return (
    <Box marginX={2} marginY={1} flexDirection="column" rowGap={1}>
      <RequestHeaders headers={err.request._header} />
      {response}
    </Box>
  );
}

interface APIErrorProps {
  err: ApiClientError | AxiosError;
  withStack: boolean;
  withHTTPMessages: "no" | "body" | "full";
}

/**
 * Render an API client error to the terminal. In the case of an API client
 * error, the error message will be displayed, as well as (when enabled) the
 * request and response headers and body.
 */
export default function APIError({
  err,
  withStack,
  withHTTPMessages,
}: APIErrorProps) {
  return (
    <Box flexDirection="column">
      <ErrorBox>
        <ErrorText bold underline>
          API CLIENT ERROR
        </ErrorText>
        <ErrorText>
          An error occurred while communicating with the API: {err.message}
        </ErrorText>

        <Text>{JSON.stringify(err.response?.data, undefined, 2)}</Text>
      </ErrorBox>

      {withHTTPMessages === "full" ? <HttpMessages err={err} /> : undefined}
      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </Box>
  );
}
