/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2MysqlCharsets.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlCharsets.Get.Parameters.Path;
export type Response = Awaited<
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
    const pathParams: PathParams = {};
    return await this.apiClient.database.listMysqlCharsets({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.database.listMysqlCharsets>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      name: {},
      collations: {
        get: (item) => item.collations.join(", "),
      },
    };
  }
}
