import { RequiredArgsError } from "@oclif/core/lib/parser/errors.js";
import { Box, Text } from "ink";
import { defaultErrorBoxProps } from "./common.js";

export default function InvalidArgsError({ err }: { err: RequiredArgsError }) {
  const color = "yellow";
  return (
    <Box {...defaultErrorBoxProps} borderColor={color}>
      <Text color={color} bold underline>
        INVALID COMMAND ARGUMENTS
      </Text>
      <Text color={color}>
        The arguments that you provided for this command were invalid.{" "}
        {err.message}
      </Text>
    </Box>
  );
}
