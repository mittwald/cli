import React, { FC } from "react";
import { Box, Text } from "ink";

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export const Note: FC<Props> = (props) => {
  const { title = "Note" } = props;

  return (
    <Box width={80} borderStyle={"round"} flexDirection="column" paddingX={2}>
      <Text bold underline>
        {title.toUpperCase()}
      </Text>
      <Text>{props.children}</Text>
    </Box>
  );
};
