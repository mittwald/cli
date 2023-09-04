/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ConversationCategoriesCategoryId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["conversation"]["getCategory"]>
>;

export abstract class GeneratedConversationGetCategory extends GetBaseCommand<
  typeof GeneratedConversationGetCategory,
  APIResponse
> {
  static description = "Get a specific conversation category.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    categoryId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.conversation.getCategory({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.conversation.getCategory>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
