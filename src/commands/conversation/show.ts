import { assertStatus } from "@mittwald/api-client-commons";
import { formatRelativeDate } from "../../rendering/textformat/formatDate.js";
import { marked, Renderer } from "marked";
import TerminalRenderer from "marked-terminal";
import chalk from "chalk";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import {
  conversationArgs,
  withConversationId,
} from "../../lib/resources/conversation/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import { printHeader } from "../../rendering/formatter/printHeader.js";
import { printKeyValues } from "../../rendering/formatter/printKeyValues.js";

type Conversation = MittwaldAPIV2.Components.Schemas.ConversationConversation;
type Message = MittwaldAPIV2.Components.Schemas.ConversationMessage;
type StatusUpdate = MittwaldAPIV2.Components.Schemas.ConversationStatusUpdate;
type ServiceRequest =
  MittwaldAPIV2.Components.Schemas.ConversationServiceRequest;

type ResponseItem = Message | StatusUpdate | ServiceRequest;

function printStatusChange(text: string, date: string) {
  console.log(chalk.gray(`${text}, ${formatRelativeDate(date)}`));
}

function printMessageAuthor(msg: Message) {
  console.log(
    chalk.whiteBright.underline(
      `${msg.createdBy?.clearName}, ${formatRelativeDate(msg.createdAt)}`,
    ),
  );
}

async function printMessageContent(msg: Message) {
  const rendered = (await marked(msg.messageContent ?? "")).trim();

  console.log(rendered);
  console.log();
}

function isMessage(msg: ResponseItem): msg is Message {
  return msg.type === "MESSAGE";
}

function isStatusUpdate(msg: ResponseItem): msg is StatusUpdate {
  return msg.type === "STATUS_UPDATE";
}

function printStatusUpdate(responseItem: StatusUpdate) {
  switch (responseItem.messageContent) {
    case "CONVERSATION_CREATED":
      printStatusChange("CREATED", responseItem.createdAt);
      break;
    case "STATUS_OPEN":
      printStatusChange("REOPENED", responseItem.createdAt);
      break;
    case "STATUS_CLOSED":
      printStatusChange("CLOSED", responseItem.createdAt);
      break;
    default:
      printStatusChange(responseItem.messageContent, responseItem.createdAt);
      break;
  }
  console.log();
}

async function printResponseItem(responseItem: ResponseItem) {
  if (isMessage(responseItem)) {
    printMessageAuthor(responseItem);
    await printMessageContent(responseItem);
  }

  if (isStatusUpdate(responseItem)) {
    printStatusUpdate(responseItem);
  }
}

function getConversationMetadata(
  conversation: MittwaldAPIV2.Components.Schemas.ConversationConversation,
) {
  return {
    Title: conversation.title,
    ID: conversation.shortId,
    Opened: `${formatRelativeDate(conversation.createdAt)} by ${
      conversation.createdBy ? conversation.createdBy.clearName : "Unknown User"
    }`,
    Status: conversation.status,
  };
}

function printConversationMetadata(
  conversation: MittwaldAPIV2.Components.Schemas.ConversationConversation,
) {
  printHeader("Conversation metadata");
  printKeyValues(getConversationMetadata(conversation));

  console.log();
}

async function printConversationMessages(responseItems: ResponseItem[]) {
  printHeader("Messages");

  marked.setOptions({
    renderer: new TerminalRenderer() as Renderer,
  });

  for (const responseItem of responseItems) {
    await printResponseItem(responseItem);
  }
}

export default class Show extends ExtendedBaseCommand<typeof Show> {
  static description = "Show a conversation and message history";
  static args = { ...conversationArgs };

  public async run(): Promise<void> {
    const conversationId = await withConversationId(
      this.apiClient,
      Show,
      this.flags,
      this.args,
      this.config,
    );

    const [conversation, responseItems] =
      await this.loadConversationWithMessages(conversationId);

    printConversationMetadata(conversation);
    await printConversationMessages(responseItems);
  }

  private async loadConversationWithMessages(
    conversationId: string,
  ): Promise<[Conversation, ResponseItem[]]> {
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

    return [conversationResponse.data, messagesResponse.data];
  }
}
