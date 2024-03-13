import React from "react";
import { FailedFlagValidationError } from "@oclif/core/lib/parser/errors.js";
import { Text } from "ink";
import ErrorBox from "./ErrorBox.js";

/** Render an error for invalid command flags. */
export default function InvalidFlagsError({
  err,
}: {
  err: FailedFlagValidationError;
}) {
  const color = "yellow";
  return (
    <ErrorBox borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND FLAGS
      </Text>
      <Text color={color}>
        The flags that you provided for this command were invalid. {err.message}
      </Text>
    </ErrorBox>
  );
}
