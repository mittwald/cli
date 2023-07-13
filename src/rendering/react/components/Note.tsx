import React, { FC, PropsWithChildren } from "react";
import { Box, Text } from "ink";

type NoteProps = PropsWithChildren<{
  title?: string;
  color?: string;
  marginY?: number;
  raw?: boolean;
}>

export const noteColor = "#407FF8";

export const Note: FC<NoteProps> = (props) => {
  const { title = "Note", color = noteColor, marginY = 0, raw = false } = props;
  const contents = raw ? props.children : <Text wrap="wrap" color={color}>{props.children}</Text>;

  return (
    <Box width={80} borderStyle={"round"} borderColor={color} flexDirection="column" paddingX={2} marginY={marginY}>
      <Text bold underline color={color}>
        {title.toUpperCase()}
      </Text>
      {contents}
    </Box>
  );
};
