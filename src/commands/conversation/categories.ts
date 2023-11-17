import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import { ListColumns } from "../../Formatter.js";
import { ListBaseCommand } from "../../ListBaseCommand.js";

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

  public async getData(): Promise<Response> {
    return await this.apiClient.conversation.listCategories();
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
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
