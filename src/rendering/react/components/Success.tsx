import React, { FC } from "react";
import { Box, Text } from "ink";

interface Props {
  title?: string;
  children?: React.ReactNode;
  color?: string;
  width?: number;
}

export const Success: FC<Props> = (props) => {
  const { title = "Success", color = "#00B785", width = 80 } = props;

  return (
    <Box width={width} borderStyle={"round"} borderColor={color} flexDirection="column" paddingX={2}>
      <Text bold underline color={color}>
        {title.toUpperCase()}
      </Text>
      <Text wrap="wrap" color={color}>{props.children}</Text>
    </Box>
  );
};
