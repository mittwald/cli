import { BaseCommand } from "../../BaseCommand.js";
import { Args } from "@oclif/core";
import { normalizeConversationIdToUuid } from "../../Helpers.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { formatRelativeDate } from "../../lib/viewhelpers/date.js";
import { marked, Renderer } from "marked";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";
import { printHeader, printKeyValues } from "../../lib/viewhelpers/tui.js";

export default class Show extends BaseCommand {
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
        conversationId,
      }),
      this.apiClient.conversation.listMessagesByConversation({
        conversationId,
      }),
    ]);

    assertStatus(conversationResponse, 200);
    assertStatus(messagesResponse, 200);

    const conv = conversationResponse.data;

    printHeader("Conversation metadata");

    printKeyValues({
      Title: conv.title,
      ID: conv.shortId,
      Opened: `${formatRelativeDate(conv.createdAt)} by ${
        conv.createdBy ? conv.createdBy.clearName : "Unknown User"
      }`,
      Status: conv.status,
    });

    console.log();

    printHeader("Messages");

    marked.setOptions({
      renderer: new TerminalRenderer() as Renderer,
      mangle: false,
      headerIds: false,
      headerPrefix: "",
    });

    const metaColor = chalk.gray;

    for (const msg of messagesResponse.data) {
      if (msg.type === "MESSAGE") {
        console.log(
          chalk.whiteBright.underline(
            `${msg.createdBy?.clearName}, ${formatRelativeDate(msg.createdAt)}`,
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
            console.log(
              metaColor(`CREATED, ${formatRelativeDate(msg.createdAt)}`),
            );
            break;
          case "STATUS_OPEN":
            console.log(
              metaColor(`REOPENED, ${formatRelativeDate(msg.createdAt)}`),
            );
            break;
          case "STATUS_CLOSED":
            console.log(
              metaColor(`CLOSED, ${formatRelativeDate(msg.createdAt)}`),
            );
            break;
          default:
            console.log(
              metaColor(
                `${msg.messageContent}, ${formatRelativeDate(msg.createdAt)}`,
              ),
            );
            break;
        }
        console.log();
      }
    }
  }
}
