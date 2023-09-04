import { BaseCommand } from "../../BaseCommand.js";
import { Args, ux } from "@oclif/core";
import { normalizeConversationIdToUuid } from "../../Helpers.js";
import { assertStatus } from "@mittwald/api-client-commons";

export default class Close extends BaseCommand {
  static description = "Close a conversation";
  static args = {
    id: Args.string({
      required: true,
      description: "ID of the conversation to show",
    }),
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(Close);
    const conversationId = await normalizeConversationIdToUuid(
      this.apiClient,
      args.id,
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
