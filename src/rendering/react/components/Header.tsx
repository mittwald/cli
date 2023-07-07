import React, { FC } from "react";
import { Box, Text } from "ink";
import { color } from "@mittwald/flow-styles/dist/tokens/ts/variables.js";

interface Props {
  title: string;
}

export const Header: FC<Props> = (props) => {
  const { title } = props;

  return (
    <Box>
      <Text bold color={color.brand.primary.lighter} underline>
        {title}
      </Text>
    </Box>
  );
};
