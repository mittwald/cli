import { Box, BoxProps, Text } from "ink";
import { FC } from "react";
import {
  FailedFlagValidationError,
  RequiredArgsError,
} from "@oclif/core/lib/parser/errors.js";
import {
  ApiClientError,
  AxiosResponseHeaders,
} from "@mittwald/api-client-commons";
import { RawAxiosResponseHeaders } from "axios";
import InteractiveInputRequiredError from "../../../lib/error/InteractiveInputRequiredError.js";

const color = "red";
const issueURL = "https://github.com/mittwald/cli/issues/new";
const boxProps: BoxProps = {
  width: 80,
  flexDirection: "column",
  borderColor: color,
  borderStyle: "round",
  paddingX: 1,
  rowGap: 1,
};

const ErrorStack: FC<{ err: Error }> = ({ err }) => {
  return (
    <Box marginX={2} marginY={1} flexDirection="column" rowGap={1}>
      <Text color={color} dimColor bold>
        ERROR STACK TRACE
      </Text>
      <Text color={color} dimColor>
        Please provide this when opening a bug report.
      </Text>
      <Text color={color} dimColor>
        {err.stack}
      </Text>
    </Box>
  );
};

const GenericError: FC<{ err: Error; withStack: boolean }> = ({
  err,
  withStack,
}) => {
  return (
    <>
      <Box {...boxProps} borderColor={color}>
        <Text color={color} bold underline>
          ERROR
        </Text>
        <Text color={color}>
          An error occurred while executing this command:
        </Text>
        <Box marginX={2}>
          <Text color={color}>{err.toString()}</Text>
        </Box>
        <Text color={color}>
          If you believe this to be a bug, please open an issue at {issueURL}.
        </Text>
      </Box>

      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </>
  );
};

const InvalidFlagsError: FC<{ err: FailedFlagValidationError }> = ({ err }) => {
  const color = "yellow";
  return (
    <Box {...boxProps} borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND FLAGS
      </Text>
      <Text color={color}>
        The flags that you provided for this command were invalid. {err.message}
      </Text>
    </Box>
  );
};

const InvalidArgsError: FC<{ err: RequiredArgsError }> = ({ err }) => {
  const color = "yellow";
  return (
    <Box {...boxProps} borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND ARGUMENTS
      </Text>
      <Text color={color}>
        The arguments that you provided for this command were invalid.{" "}
        {err.message}
      </Text>
    </Box>
  );
};

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

const ApiError: FC<{
  err: ApiClientError;
  withStack: boolean;
  withHTTPMessages: "no" | "body" | "full";
}> = ({ err, withStack, withHTTPMessages }) => {
  return (
    <>
      <Box {...boxProps}>
        <Text color={color} bold underline>
          API CLIENT ERROR
        </Text>
        <Text color={color}>
          An error occurred while communicating with the API: {err.message}
        </Text>

        <Text>{JSON.stringify(err.response?.data, undefined, 2)}</Text>
      </Box>

      {withHTTPMessages === "full" ? <HttpMessages err={err} /> : undefined}
      {withStack && "stack" in err ? <ErrorStack err={err} /> : undefined}
    </>
  );
};

/**
 * Render an error to the terminal.
 *
 * @class
 * @param err The error to render. May be anything, although different errors
 *   will be rendered differently.
 */
export const ErrorBox: FC<{ err: unknown }> = ({ err }) => {
  if (err instanceof FailedFlagValidationError) {
    return <InvalidFlagsError err={err} />;
  } else if (err instanceof RequiredArgsError) {
    return <InvalidArgsError err={err} />;
  } else if (err instanceof ApiClientError) {
    return <ApiError err={err} withStack withHTTPMessages="body" />;
  } else if (err instanceof InteractiveInputRequiredError) {
    return <GenericError err={err} withStack={false} />;
  } else if (err instanceof Error) {
    return <GenericError err={err} withStack />;
  }

  const realError = new Error((err as { toString(): string }).toString());
  return <GenericError err={realError} withStack={false} />;
};
