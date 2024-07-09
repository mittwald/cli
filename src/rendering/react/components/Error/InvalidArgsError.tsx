import { Text } from "ink";
import ErrorBox from "./ErrorBox.js";

/** Render an error for invalid command arguments. */
export default function InvalidArgsError({ err }: { err: Error }) {
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
