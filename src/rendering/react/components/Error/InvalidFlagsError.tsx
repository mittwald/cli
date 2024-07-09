import React from "react";
import { Text } from "ink";
import ErrorBox from "./ErrorBox.js";

interface Props {
  err: Error;
}

/** Render an error for invalid command flags. */
export default function InvalidFlagsError({ err }: Props) {
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
