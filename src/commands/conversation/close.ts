import { ux } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import {
  conversationArgs,
  withConversationId,
} from "../../lib/resources/conversation/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";

export default class Close extends ExtendedBaseCommand<typeof Close> {
  static description = "Close a conversation";
  static args = {
    ...conversationArgs,
  };

  public async run(): Promise<void> {
    const conversationId = await withConversationId(
      this.apiClient,
      Close,
      this.flags,
      this.args,
      this.config,
    );

    ux.action.start(`closing conversation ${conversationId}`);

    const response = await this.apiClient.conversation.setConversationStatus({
      conversationId,
      data: { status: "closed" },
    });

    assertStatus(response, 200);

    ux.action.stop();
  }
}
