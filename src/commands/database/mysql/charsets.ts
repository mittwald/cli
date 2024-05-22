import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2MysqlCharsets.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlCharsets"]>
>;

export class Charsets extends ListBaseCommand<
  typeof Charsets,
  ResponseItem,
  Response
> {
  static description =
    "List available MySQL character sets and collations, optionally filtered by a MySQLVersion.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.database.listMysqlCharsets({});
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      name: {},
      collations: {
        get: (item) => item.collations.join(", "),
      },
    };
  }
}
