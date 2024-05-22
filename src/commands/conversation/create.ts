import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { Flags, ux } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import {
  messageFlags,
  retrieveMessage,
} from "../../lib/resources/conversation/message_input.js";

export default class Create extends BaseCommand {
  static description = "Create a new conversation";

  static flags = {
    ...BaseCommand.baseFlags,
    ...messageFlags,
    title: Flags.string({
      description: "Title of the conversation",
      required: true,
    }),
    category: Flags.string({
      description:
        "Category of the conversation; use the 'conversation categories' command to list available categories",
      default: "general",
    }),
  };

  private async getCategoryId(name: string): Promise<string> {
    const categoryResponse = await this.apiClient.conversation.listCategories();
    assertStatus(categoryResponse, 200);

    const category = categoryResponse.data.find((c) => c.name === name);
    if (!category) {
      throw new Error(`category ${name} not found`);
    }

    return category.categoryId;
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Create);

    const messageContent = await retrieveMessage(flags);
    const categoryId = await this.getCategoryId(flags.category);

    ux.action.start("creating conversation");

    const conversationResponse =
      await this.apiClient.conversation.createConversation({
        data: {
          title: flags.title,
          categoryId,
        },
      });

    assertStatus(conversationResponse, 201);

    ux.action.stop();

    const conversationId = conversationResponse.data.conversationId;

    ux.action.start(`saving message for ${conversationId}`);

    const response = await this.apiClient.conversation.createMessage({
      conversationId,
      data: { messageContent },
    });

    assertStatus(response, 201);

    ux.action.stop();
  }
}
