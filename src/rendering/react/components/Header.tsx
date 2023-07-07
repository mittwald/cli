import React, { FC } from "react";
import { Box, Text } from "ink";

interface Props {
  title: string;
}

export const Header: FC<Props> = (props) => {
  const { title } = props;

  return (
    <Box>
      <Text bold underline>
        {title}
      </Text>
    </Box>
  );
};
