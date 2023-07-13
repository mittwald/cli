import React, { FC, PropsWithChildren } from "react";
import { Box, Text } from "ink";

type NoteProps = PropsWithChildren<{
  title?: string;
  color?: string;
  marginY?: number;
}>

export const Note: FC<NoteProps> = (props) => {
  const { title = "Note", color = "#407FF8", marginY = 0 } = props;

  return (
    <Box width={80} borderStyle={"round"} borderColor={color} flexDirection="column" paddingX={2} marginY={marginY}>
      <Text bold underline color={color}>
        {title.toUpperCase()}
      </Text>
      <Text wrap="wrap" color={color}>{props.children}</Text>
    </Box>
  );
};
