import { FC } from "react";
import { Box, Text } from "ink";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { useMyUserProfile } from "../../hooks/useMyUserProfile.js";

type Message =
  | MittwaldAPIV2.Components.Schemas.ConversationMessage
  | MittwaldAPIV2.Components.Schemas.ConversationStatusUpdate;

interface Props {
  message: Message;
}

export const ConversationMessage: FC<Props> = (props) => {
  const { message } = props;

  const { userId } = useMyUserProfile();

  if (message.type === "MESSAGE") {
    const isMyMessage = userId === message.createdBy?.userId;

    return (
      <Box
        borderStyle="round"
        padding={1}
        marginLeft={isMyMessage ? 10 : 0}
        marginRight={isMyMessage ? 0 : 10}
      >
        <Text>{message.messageContent}</Text>
      </Box>
    );
  }

  return (
    <Box justifyContent="center" padding={1}>
      <Text dimColor>{message.messageContent}</Text>
    </Box>
  );
};
