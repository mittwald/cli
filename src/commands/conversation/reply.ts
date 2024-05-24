import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import {
  messageFlags,
  retrieveMessage,
} from "../../lib/resources/conversation/message_input.js";
import {
  conversationArgs,
  withConversationId,
} from "../../lib/resources/conversation/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { ux } from "@oclif/core";

export default class Reply extends ExtendedBaseCommand<typeof Reply> {
  static description = "Reply to a conversation";
  static args = { ...conversationArgs };

  static flags = {
    ...BaseCommand.baseFlags,
    ...messageFlags,
  };

  public async run(): Promise<void> {
    const conversationId = await withConversationId(
      this.apiClient,
      Reply,
      this.flags,
      this.args,
      this.config,
    );

    const messageContent = await retrieveMessage(this.flags);

    ux.action.start(`replying to ${conversationId}`);

    const response = await this.apiClient.conversation.createMessage({
      conversationId,
      data: { messageContent },
    });

    assertStatus(response, 201);

    ux.action.stop();
  }
}
