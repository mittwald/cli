import { FC } from "react";
import { defaultErrorBoxProps, defaultErrorColor } from "./common.js";
import { ErrorStack } from "./ErrorStack.js";
import {
  ApiClientError,
  AxiosResponseHeaders,
} from "@mittwald/api-client-commons";
import { Box, Text } from "ink";
import { RawAxiosResponseHeaders } from "axios";

const RequestHeaders: FC<{ headers: string }> = ({ headers }) => {
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
};

const Response: FC<{
  status: number;
  statusText: string;
  body: unknown;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
}> = ({ status, statusText, body, headers }) => {
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
};

const HttpMessages: FC<{ err: ApiClientError }> = ({ err }) => {
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
};

export const ApiError: FC<{
  err: ApiClientError;
  withStack: boolean;
  withHTTPMessages: "no" | "body" | "full";
}> = ({ err, withStack, withHTTPMessages }) => {
  return (
    <>
      <Box {...defaultErrorBoxProps}>
        <Text color={defaultErrorColor} bold underline>
          API CLIENT ERROR
        </Text>
        <Text color={defaultErrorColor}>
          An error occurred while communicating with the API: {err.message}
        </Text>

        <Text>{JSON.stringify(err.response?.data, undefined, 2)}</Text>
      </Box>

      {withHTTPMessages === "full" ? <HttpMessages err={err} /> : undefined}
      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </>
  );
};
