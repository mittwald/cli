import React, { Suspense } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { usePromise } from "@mittwald/react-use-promise";
import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import { useRenderContext } from "../../rendering/react/context.js";
import { UsePromiseRenderSetup } from "../../rendering/setup/usePromiseSetup.js";
import { Box } from "ink";
import { ConversationMeta } from "../../rendering/react/components/Conversation/ConversationMeta.js";
import { Args } from "@oclif/core";
import { ConversationMessages } from "../../rendering/react/components/Conversation/ConversationMessages.js";

const usePromiseSetup = new UsePromiseRenderSetup();

export default class Show extends RenderBaseCommand<typeof Show> {
  public static flags = {
    ...usePromiseSetup.flags,
    ...RenderBaseCommand.buildFlags(),
  };

  public static args = {
    conversationId: Args.string({
      required: true,
    }),
  };

  protected render(): React.ReactNode {
    const { apiClient } = useRenderContext();
    const { conversationId } = this.args;

    const usePromiseOptions = usePromiseSetup.getSetup(this.flags);

    const response = usePromise(
      apiClient.conversation.listMessagesByConversation,
      [
        {
          conversationId,
        },
      ],
      {
        loaderId: "listMessagesByConversation",
        ...usePromiseOptions,
      },
    );

    assertStatus(response, 200);

    return (
      <Box flexDirection="column">
        <Suspense fallback={null}>
          <ConversationMeta id={conversationId} />
        </Suspense>
        <ConversationMessages messages={response.data} />
      </Box>
    );
  }
}
