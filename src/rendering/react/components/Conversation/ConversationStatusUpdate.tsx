import { FC } from "react";
import { Box, Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type Message = MittwaldAPIV2.Components.Schemas.ConversationStatusUpdate;

interface Props {
  message: Message;
}

export const ConversationMessage: FC<Props> = (props) => {
  const { message } = props;

  return (
    <Box justifyContent="center" padding={1}>
      <Text dimColor>{message.messageContent}</Text>
    </Box>
  );
};
