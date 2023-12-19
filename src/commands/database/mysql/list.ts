import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags } from "../../../lib/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMysqlDatabases.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlDatabases"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List MySQLDatabases belonging to a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.database.listMysqlDatabases({
      projectId,
    });
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(ignoredData: ResponseItem[]): ListColumns<ResponseItem> {
    const commonColumns = super.getColumns(ignoredData);
    return {
      id: commonColumns.id,
      name: {
        header: "Name",
        minWidth: 12,
      },
      version: {
        header: "Version",
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
      characterSet: {
        header: "Character Set",
        get: (row) => row.characterSettings?.characterSet,
        extended: true,
      },
      collation: {
        header: "Collation",
        get: (row) => row.characterSettings?.collation,
        extended: true,
      },
      createdAt: commonColumns.createdAt,
    };
  }
}
