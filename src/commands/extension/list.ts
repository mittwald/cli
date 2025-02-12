import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../rendering/formatter/Table.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Extensions.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["marketplace"]["extensionListExtensions"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "Get all available extensions.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.marketplace.extensionListExtensions();
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id } = super.getColumns(data, {});
    return {
      id,
      name: {},
    };
  }
}
