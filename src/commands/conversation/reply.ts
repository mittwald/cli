import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { Args, ux } from "@oclif/core";
import { normalizeConversationId } from "../../normalize_id.js";
import { assertStatus } from "@mittwald/api-client-commons";
import {
  messageFlags,
  retrieveMessage,
} from "../../lib/conversation/message_input.js";

export default class Reply extends BaseCommand {
  static description = "Reply to a conversation";
  static args = {
    id: Args.string({
      required: true,
      description: "ID of the conversation to show",
    }),
  };

  static flags = {
    ...BaseCommand.baseFlags,
    ...messageFlags,
  };

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Reply);
    const conversationId = await normalizeConversationId(
      this.apiClient,
      args.id,
    );

    const messageContent = await retrieveMessage(flags);

    ux.action.start(`replying to ${conversationId}`);

    const response = await this.apiClient.conversation.createMessage({
      conversationId,
      data: { messageContent },
    });

    assertStatus(response, 201);

    ux.action.stop();
  }
}
