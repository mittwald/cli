import React, { Suspense } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { usePromise } from "@mittwald/react-use-promise";
import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { UsePromiseRenderSetup } from "../../rendering/setup/usePromiseSetup.js";
import { Box } from "ink";
import { ConversationMeta } from "../../rendering/react/components/ConversationMeta.js";
import { Args } from "@oclif/core";
import { ConversationMessage } from "../../rendering/react/components/ConversationMessage.js";

const usePromiseSetup = new UsePromiseRenderSetup();

export default class Show extends RenderBaseCommand<typeof Show> {
  public static flags = {
    ...usePromiseSetup.flags,
  };

  public static args = {
    conversationId: Args.string({
      required: true,
    }),
  };

  protected render(): React.ReactNode {
    const { apiClient } = useRenderContext();
    const { conversationId } = this.args;

    const response = usePromise(
      apiClient.conversation.listMessagesByConversation,
      [
        {
          pathParameters: {
            conversationId,
          },
        },
      ],
      {
        loaderId: "listMessagesByConversation",
      },
    );

    assertStatus(response, 200);

    return (
      <Box flexDirection="column">
        <Suspense fallback={null}>
          <ConversationMeta id={conversationId} />
        </Suspense>
        <Box flexDirection="column">
          {response.data.map((msg, index) => (
            <ConversationMessage key={index} message={msg} />
          ))}
        </Box>
      </Box>
    );
  }
}
