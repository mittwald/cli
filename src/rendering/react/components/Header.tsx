import React, { FC, ReactNode } from "react";
import { Box, Text } from "ink";

interface Props {
  title: ReactNode;
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
