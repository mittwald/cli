import React, { FC } from "react";
import { useRenderContext } from "../../context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { RenderJson } from "../../json/RenderJson.js";
import { Header } from "../Header.js";

interface Props {
  id: string;
}

export const ConversationMeta: FC<Props> = (props) => {
  const { id } = props;

  const { apiClient, renderAsJson } = useRenderContext();

  const conversationResponse = usePromise(
    apiClient.conversation.getConversation,
    [
      {
        pathParameters: {
          conversationId: id,
        },
      },
    ],
    {
      loaderId: "getConversation",
    },
  );

  assertStatus(conversationResponse, 200);

  const { title } = conversationResponse.data;

  if (renderAsJson) {
    return (
      <RenderJson name="conversationMeta" data={conversationResponse.data} />
    );
  }

  return <Header title={title} />;
};
