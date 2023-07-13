/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ConversationCategories.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["conversation"]["listCategories"]>
>;

export abstract class GeneratedConversationListCategories<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedConversationListCategories,
  TItem,
  Response
> {
  static description = "Get all conversation categories.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.conversation.listCategories({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.conversation.listCategories>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
