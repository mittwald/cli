import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdRedisDatabases.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdRedisDatabases.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listRedisDatabases"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List Redis databases belonging to a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await withProjectId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.database.listRedisDatabases({
      pathParameters: { projectId },
    } as Parameters<typeof this.apiClient.database.listRedisDatabases>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      name: {},
      version: {},
      description: {},
      hostname: {},
      createdAt: baseColumns.createdAt,
    };
  }
}
