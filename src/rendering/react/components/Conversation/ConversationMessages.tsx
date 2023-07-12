import React, { FC } from "react";
import { Box } from "ink";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { ConversationMessage } from "./ConversationMessage.js";
import { useRenderContext } from "../../context.js";
import { RenderJson } from "../../json/RenderJson.js";

type Message =
  | MittwaldAPIV2.Components.Schemas.ConversationMessage
  | MittwaldAPIV2.Components.Schemas.ConversationStatusUpdate;

interface Props {
  messages: Message[];
}

export const ConversationMessages: FC<Props> = (props) => {
  const { messages } = props;

  const { renderAsJson } = useRenderContext();

  if (renderAsJson) {
    return <RenderJson name="messages" data={messages} />;
  }

  return (
    <Box flexDirection="column">
      {messages.map((msg) => (
        <ConversationMessage key={msg.createdAt + msg.type} message={msg} />
      ))}
    </Box>
  );
};
