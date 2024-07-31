import { Simplify } from "@mittwald/api-client-commons";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";

type ProjectResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Projects.Get.Responses.$200.Content.ApplicationJson[number]
>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listProjects"]>
>;

export class List extends ListBaseCommand<
  typeof List,
  ProjectResponseItem,
  Response
> {
  static description = "List all projects that you have access to";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.project.listProjects();
  }

  protected getColumns(
    ignoredData: ProjectResponseItem[],
  ): ListColumns<ProjectResponseItem> {
    const { id, shortId, createdAt } = super.getColumns(ignoredData);
    return {
      id,
      shortId,
      customerId: {
        header: "Org ID",
        extended: true,
      },
      description: {
        header: "Description",
      },
      status: {
        header: "Status",
        get: (row) => {
          if (!row.enabled) {
            return "disabled";
          }
          return row.readiness;
        },
      },
      createdAt,
    };
  }
}
