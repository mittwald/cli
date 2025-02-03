import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../rendering/formatter/Table.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

type ResponseItem = {
  id: string;
  kind: "mysql" | "redis";
  name: string;
  version: string;
  description: string;
  hostname: string;
  isReady: boolean;
  createdAt: string;
};
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlDatabases"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List all kinds of databases belonging to a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<ResponseItem[]> {
    const projectId = await this.withProjectId(List);
    const databases: ResponseItem[] = [];

    const mysqlResponse = await this.apiClient.database.listMysqlDatabases({
      projectId,
    });
    assertStatus(mysqlResponse, 200);

    const redisResponse = await this.apiClient.database.listRedisDatabases({
      projectId,
    });
    assertStatus(redisResponse, 200);

    databases.push(
      ...mysqlResponse.data.map((d) => ({ ...d, kind: "mysql" as const })),
      ...redisResponse.data.map((d) => ({
        ...d,
        kind: "redis" as const,
        isReady: true,
      })),
    );

    return databases;
  }

  protected getColumns(ignoredData: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, name, createdAt } = super.getColumns(ignoredData, {
      shortIdKey: "name",
    });
    return {
      id,
      name,
      version: {
        header: "Version",
        get(row) {
          if (row.kind === "mysql") {
            return `MySQL ${row.version}`;
          } else if (row.kind === "redis") {
            return `Redis ${row.version}`;
          } else {
            return "Unknown";
          }
        },
      },
      description: {
        header: "Description",
      },
      hostname: {
        header: "Hostname",
      },
      status: {
        header: "Status",
        get: (row) => {
          if (!row.isReady) {
            return "pending";
          }
          return "ready";
        },
      },
      createdAt,
    };
  }
}
