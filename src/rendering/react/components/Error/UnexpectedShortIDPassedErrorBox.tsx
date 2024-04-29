import React from "react";
import { Text, Newline } from "ink";
import ErrorBox from "./ErrorBox.js";
import UnexpectedShortIDPassedError from "../../../../lib/error/UnexpectedShortIDPassedError.js";

export default function UnexpectedShortIDPassedErrorBox({
  err,
}: {
  err: UnexpectedShortIDPassedError;
}) {
  const color = "yellow";
  return (
    <ErrorBox borderColor={color}>
      <Text color={color} bold underline>
        UNEXPECTED RESOURCE TYPE
      </Text>
      <Text color={color}>
        Whoops! It looks like you passed an ID for an unexpected resource type.
        <Newline />
        {err.message}
      </Text>
    </ErrorBox>
  );
}
