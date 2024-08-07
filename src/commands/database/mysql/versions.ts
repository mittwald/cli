import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2MysqlVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlVersions"]>
>;

export class Versions extends ListBaseCommand<
  typeof Versions,
  ResponseItem,
  Response
> {
  static description = "List available MySQL versions.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.database.listMysqlVersions({});
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: { header: "ID" },
      name: {},
      version: { get: (item) => item.number },
    };
  }
}
