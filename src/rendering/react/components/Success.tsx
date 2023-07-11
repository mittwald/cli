import React, { FC } from "react";
import { Box, Text } from "ink";

interface Props {
  title?: string;
  children?: React.ReactNode;
  color?: string;
}

export const Success: FC<Props> = (props) => {
  const { title = "Success", color = "#00B785" } = props;

  return (
    <Box width={80} borderStyle={"round"} borderColor={color} flexDirection="column" paddingX={2}>
      <Text bold underline color={color}>
        {title.toUpperCase()}
      </Text>
      <Text wrap="wrap" color={color}>{props.children}</Text>
    </Box>
  );
};
