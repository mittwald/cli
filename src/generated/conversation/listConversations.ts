/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2Conversations.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["conversation"]["listConversations"]>
>;

export abstract class GeneratedConversationListConversations<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedConversationListConversations,
  TItem,
  Response
> {
  static description =
    "Get all conversation the authenticated user has created or has access to.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.conversation.listConversations(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.conversation.listConversations
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
