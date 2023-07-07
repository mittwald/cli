import { BaseCommand } from "../../BaseCommand.js";
import { Args, ux } from "@oclif/core";
import { normalizeConversationIdToUuid } from "../../Helpers.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { formatDate } from "../../lib/viewhelpers/date.js";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";
import { printHeader, printKeyValues } from "../../lib/viewhelpers/tui.js";

export default class Show extends BaseCommand<typeof Show> {
  static description = "Show a conversation and message history";
  static args = {
    id: Args.string({
      required: true,
      description: "ID of the conversation to show",
    }),
  };

  public async run(): Promise<void> {
    const { args } = await this.parse(Show);
    const conversationId = await normalizeConversationIdToUuid(
      this.apiClient,
      args.id,
    );

    const [conversationResponse, messagesResponse] = await Promise.all([
      this.apiClient.conversation.getConversation({
        pathParameters: { conversationId },
      }),
      this.apiClient.conversation.listMessagesByConversation({
        pathParameters: { conversationId },
      }),
    ]);

    assertStatus(conversationResponse, 200);
    assertStatus(messagesResponse, 200);

    const conv = conversationResponse.data;

    printHeader("Conversation metadata");

    printKeyValues({
      Title: conv.title,
      ID: conv.shortId,
      Opened: `${formatDate(conv.createdAt)} by ${
        conv.createdBy ? conv.createdBy.clearName : "Unknown User"
      }`,
      Status: conv.status,
    });

    console.log();

    printHeader("Messages");

    marked.setOptions({
      renderer: new TerminalRenderer() as any,
      mangle: false,
      headerIds: false,
      headerPrefix: "",
    });

    const metaColor = chalk.gray;

    for (const msg of messagesResponse.data) {
      if (msg.type === "MESSAGE") {
        console.log(
          chalk.whiteBright.underline(
            `${msg.createdBy?.clearName}, ${formatDate(msg.createdAt)}`,
          ),
        );

        const rendered = marked(msg.messageContent ?? "")
          .trim()
          .split("\n")
          //.map((l) => `| ${l}`)
          .join("\n");

        console.log(rendered);
        console.log();
      } else {
        switch (msg.messageContent) {
          case "CONVERSATION_CREATED":
            console.log(metaColor(`CREATED, ${formatDate(msg.createdAt)}`));
            break;
          case "STATUS_OPEN":
            console.log(metaColor(`REOPENED, ${formatDate(msg.createdAt)}`));
            break;
          case "STATUS_CLOSED":
            console.log(metaColor(`CLOSED, ${formatDate(msg.createdAt)}`));
            break;
          default:
            console.log(
              metaColor(`${msg.messageContent}, ${formatDate(msg.createdAt)}`),
            );
            break;
        }
        console.log();
      }
    }
  }
}
