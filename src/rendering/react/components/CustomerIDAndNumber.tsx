import { FC } from "react";
import { Value } from "./Value.js";
import { Box, Text } from "ink";

export const CustomerIDAndNumber: FC<{
  object: { customerId: string; customerNumber: string };
}> = ({ object }) => {
  return (
    <Box flexDirection="row">
      <Value>{object.customerNumber}</Value>
      <Text> / </Text>
      <Value>{object.customerId}</Value>
    </Box>
  );
};
