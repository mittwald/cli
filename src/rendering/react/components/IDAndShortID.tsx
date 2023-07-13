import { FC } from "react";
import { Value } from "./Value.js";
import { Box, Text } from "ink";

export const IDAndShortID: FC<{ object: { id: string; shortId: string } }> = ({
  object,
}) => {
  return (
    <Box flexDirection="row">
      <Value>{object.shortId}</Value>
      <Text> / </Text>
      <Value>{object.id}</Value>
    </Box>
  );
};
