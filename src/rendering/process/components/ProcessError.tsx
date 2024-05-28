import React from "react";
import { isValidationError } from "../../../lib/error/handleError.js";
import { ProcessValidationErrors } from "./ProcessValidationErrors.js";
import { Box, Text } from "ink";

export const ProcessError: React.FC<{ err: unknown }> = ({ err }) => {
  if (isValidationError(err)) {
    return <ProcessValidationErrors err={err.response.data} />;
  }

  return (
    <Box marginY={1} marginX={5} flexDirection="column">
      <Text color="red">An error occurred during this operation:</Text>
      <Text color="red" bold>
        {err?.toString()}
      </Text>
    </Box>
  );
};
