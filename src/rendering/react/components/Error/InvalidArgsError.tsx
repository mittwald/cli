import { RequiredArgsError } from "@oclif/core/lib/parser/errors.js";
import { Text } from "ink";
import ErrorBox from "./ErrorBox.js";

export default function InvalidArgsError({ err }: { err: RequiredArgsError }) {
  const color = "yellow";
  return (
    <ErrorBox borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND ARGUMENTS
      </Text>
      <Text color={color}>
        The arguments that you provided for this command were invalid.{" "}
        {err.message}
      </Text>
    </ErrorBox>
  );
}
