import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../../types.js";
import { ListBaseCommand } from "../../../../ListBaseCommand.js";
import { Flags } from "@oclif/core";
import { ListColumns } from "../../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2MysqlDatabasesDatabaseIdUsers.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlDatabasesDatabaseIdUsers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlUsers"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List MySQL users belonging to a database.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "database-id": Flags.string({
      description: "ID of the MySQL database to list users for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      databaseId: this.flags["database-id"],
    };
    return await this.apiClient.database.listMysqlUsers(
      pathParams as Parameters<
        typeof this.apiClient.database.listMysqlUsers
      >[0],
    );
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      name: {},
      description: {},
      mainUser: {
        header: "Main user",
        get: (i) => (i.mainUser ? "yes" : "no"),
      },
      enabled: { get: (item) => (item.disabled ? "no" : "yes") },
      externalAccess: {
        header: "External access",
        get: (i) => (i.externalAccess ? "yes" : "no"),
      },
      createdAt: baseColumns.createdAt,
    };
  }
}
