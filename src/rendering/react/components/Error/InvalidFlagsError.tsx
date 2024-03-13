import React from "react";
import { FailedFlagValidationError } from "@oclif/core/lib/parser/errors.js";
import { defaultErrorBoxProps } from "./common.js";
import { Box, Text } from "ink";

export default function InvalidFlagsError({
  err,
}: {
  err: FailedFlagValidationError;
}) {
  const color = "yellow";
  return (
    <Box {...defaultErrorBoxProps} borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND FLAGS
      </Text>
      <Text color={color}>
        The flags that you provided for this command were invalid. {err.message}
      </Text>
    </Box>
  );
}
