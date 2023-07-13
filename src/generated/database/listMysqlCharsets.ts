/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlCharsets.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlCharsets"]>
>;

export abstract class GeneratedDatabaseListMysqlCharsets<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedDatabaseListMysqlCharsets,
  TItem,
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
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.database.listMysqlCharsets>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
