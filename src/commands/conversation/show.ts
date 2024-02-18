import { BaseCommand } from "../../BaseCommand.js";
import { Args } from "@oclif/core";
import { normalizeConversationId } from "../../normalize_id.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { formatRelativeDate } from "../../lib/viewhelpers/date.js";
import { marked, Renderer } from "marked";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";

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
    const conversationId = await normalizeConversationId(
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

    console.log(chalk.bold.white("Conversation metadata"));
    console.log(chalk.bold.white("─".repeat("Conversation metadata".length)));
    console.log();

    const keys = Object.keys({
      Title: conv.title,
      ID: conv.shortId,
      Opened: `${formatRelativeDate(conv.createdAt)} by ${
        conv.createdBy ? conv.createdBy.clearName : "Unknown User"
      }`,
      Status: conv.status,
    });
    const l = Math.max(...keys.map((k) => k.length));

    for (const key of keys) {
      console.log(
        chalk.blueBright(key.padEnd(l, " ")),
        " ",
        {
          Title: conv.title,
          ID: conv.shortId,
          Opened: `${formatRelativeDate(conv.createdAt)} by ${
            conv.createdBy ? conv.createdBy.clearName : "Unknown User"
          }`,
          Status: conv.status,
        }[key],
      );
    }

    console.log();

    console.log(chalk.bold.white("Messages"));
    console.log(chalk.bold.white("─".repeat("Messages".length)));
    console.log();

    marked.setOptions({
      renderer: new TerminalRenderer() as Renderer,
    });

    for (const msg of messagesResponse.data) {
      if (msg.type === "MESSAGE") {
        console.log(
          chalk.whiteBright.underline(
            `${msg.createdBy?.clearName}, ${formatRelativeDate(msg.createdAt)}`,
          ),
        );

        const rendered = (await marked(msg.messageContent ?? ""))
          .trim()
          .split("\n")
          .join("\n");

        console.log(rendered);
        console.log();
      } else {
        switch (msg.messageContent) {
          case "CONVERSATION_CREATED":
            console.log(
              chalk.gray(`CREATED, ${formatRelativeDate(msg.createdAt)}`),
            );
            break;
          case "STATUS_OPEN":
            console.log(
              chalk.gray(`REOPENED, ${formatRelativeDate(msg.createdAt)}`),
            );
            break;
          case "STATUS_CLOSED":
            console.log(
              chalk.gray(`CLOSED, ${formatRelativeDate(msg.createdAt)}`),
            );
            break;
          default:
            console.log(
              chalk.gray(
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
