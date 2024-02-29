import React from "react";
import { Box, BoxProps, Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type CommonsValidationErrors =
  MittwaldAPIV2.Components.Schemas.CommonsValidationErrors;

const boxProps: BoxProps = {
  marginY: 1,
  marginX: 5,
  paddingX: 1,
  borderColor: "color",
  borderStyle: "round",
  flexDirection: "column",
  width: 80,
};

export const ProcessValidationErrors: React.FC<{
  err: CommonsValidationErrors;
  color?: string;
}> = ({ err, color = "red" }) => {
  const errorItems = err.validationErrors.map((e, idx) => {
    return (
      <Box flexDirection="row" key={idx}>
        {e.path && (
          <Box minWidth={e.path + 2}>
            <Text color={color} bold>
              {e.path}:{" "}
            </Text>
          </Box>
        )}
        <Text color={color}>{e.message}</Text>
      </Box>
    );
  });

  return (
    <Box {...boxProps}>
      <Text color={color}>Your input contained invalid data:</Text>
      <Box flexDirection="column" marginY={1}>
        {errorItems}
      </Box>
      <Text color={color}>
        Please correct the errors and try again. Consult this command's help
        page (by invoking it with the --help flag) for more information.
      </Text>
    </Box>
  );
};
