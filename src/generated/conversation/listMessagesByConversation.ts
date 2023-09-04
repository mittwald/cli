/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ConversationsConversationIdMessages.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["conversation"]["listMessagesByConversation"]>
>;

export abstract class GeneratedConversationListMessagesByConversation<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedConversationListMessagesByConversation,
  TItem,
  Response
> {
  static description = "Get all message of the conversation.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "conversation-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      conversationId: this.flags["conversation-id"],
    };
    return await this.apiClient.conversation.listMessagesByConversation(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.conversation.listMessagesByConversation
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
