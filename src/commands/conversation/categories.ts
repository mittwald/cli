import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ConversationCategories.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["conversation"]["listCategories"]>
>;

export default class Categories extends ListBaseCommand<
  typeof Categories,
  ResponseItem,
  Response
> {
  static description = "Get all conversation categories.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public getData(): Promise<Response> {
    return this.apiClient.conversation.listCategories();
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: {
        header: "ID",
        minWidth: 36,
        extended: true,
      },
      name: {},
    };
  }
}
