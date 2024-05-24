import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import FlagSetBuilder from "../../context/FlagSetBuilder.js";
import { contextIDNormalizers } from "../../context/Context.js";

async function normalize(
  apiClient: MittwaldAPIV2Client,
  conversationId: string,
): Promise<string> {
  const conversation = await apiClient.conversation.getConversation({
    conversationId,
  });
  assertStatus(conversation, 200);

  return conversation.data.conversationId;
}

contextIDNormalizers["conversation-id"] = normalize;

export const {
  flags: conversationFlags,
  args: conversationArgs,
  withId: withConversationId,
} = new FlagSetBuilder("conversation", "c", { normalize }).build();
