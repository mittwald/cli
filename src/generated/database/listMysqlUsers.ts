/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlDatabasesDatabaseIdUsers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlUsers"]>
>;

export abstract class GeneratedDatabaseListMysqlUsers<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedDatabaseListMysqlUsers,
  TItem,
  Response
> {
  static description = "List MySQLUsers belonging to a database.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "database-id": Flags.string({
      description: "ID of the MySQLDatabase to list Users for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      databaseId: this.flags["database-id"],
    };
    return await this.apiClient.database.listMysqlUsers({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.database.listMysqlUsers>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
