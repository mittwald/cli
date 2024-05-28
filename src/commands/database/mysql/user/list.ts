import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../../../lib/basecommands/ListBaseCommand.js";
import { Flags } from "@oclif/core";
import { ListColumns } from "../../../../rendering/formatter/ListFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2MysqlDatabasesMysqlDatabaseIdUsers.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
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
    return await this.apiClient.database.listMysqlUsers({
      mysqlDatabaseId: this.flags["database-id"],
    });
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, name, createdAt } = super.getColumns(data, {
      shortIdKey: "name",
    });
    return {
      id,
      name,
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
      createdAt,
    };
  }
}
