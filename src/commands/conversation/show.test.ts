import { expect, test } from "@oclif/test";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type Conversation = MittwaldAPIV2.Components.Schemas.ConversationConversation;
type Message = MittwaldAPIV2.Components.Schemas.ConversationMessage;
type StatusUpdate = MittwaldAPIV2.Components.Schemas.ConversationStatusUpdate;

describe("conversation:show", () => {
  const conversationId = "186f8f22-aa0f-42bf-909d-757cb9d27b04";
  const userId = "6dbd84b5-74e0-43ed-8a81-b0b8a0405a47";
  const messageId = "10a59409-ff2d-478e-b07f-72c8f9f5b63f";
  const now = new Date();
  const user = {
    userId,
    clearName: "John Doe",
  };

  test
    .nock("https://api.mittwald.de", (api) => {
      api
        .persist()
        .get(`/v2/conversations/${conversationId}`)
        .reply(200, {
          conversationId,
          shortId: "CONV-ID",
          createdAt: now.toJSON(),
          title: "Test conversation",
          status: "open",
          visibility: "shared",
          mainUser: user,
        } satisfies Conversation);

      api.get(`/v2/conversations/${conversationId}/messages`).reply(200, [
        {
          conversationId,
          type: "STATUS_UPDATE",
          createdAt: now.toJSON(),
          meta: { user },
          messageContent: "CONVERSATION_CREATED",
        },
        {
          messageId,
          conversationId,
          type: "MESSAGE",
          createdAt: now.toJSON(),
          createdBy: user,
          messageContent: "Hello, World!",
        },
        {
          conversationId,
          type: "STATUS_UPDATE",
          createdAt: now.toJSON(),
          meta: { user },
          messageContent: "STATUS_CLOSED",
        },
      ] satisfies Array<Message | StatusUpdate>);
    })
    .env({ MITTWALD_API_TOKEN: "foo" })
    .stdout()
    .command(["conversation show", conversationId])
    .it("shows a conversation and its messages", (ctx) => {
      expect(ctx.stdout.trim()).to.equal(`Conversation metadata
─────────────────────

Title    Test conversation
ID       CONV-ID
Opened   less than a minute ago by Unknown User
Status   open

Messages
────────

CREATED, less than a minute ago

John Doe, less than a minute ago
Hello, World!

CLOSED, less than a minute ago`);
    });
});
