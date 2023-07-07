import { Simplify } from "@mittwald/api-client-commons";
import { ListColumns } from "../../Formatter.js";
import {
  MittwaldAPIV2,
  MittwaldAPIV2Client as MittwaldAPIClient,
} from "@mittwald/api-client";
import { GeneratedProjectListProjects } from "../../generated/project/listProjects.js";
import { SuccessfulResponse } from "../../types.js";

type ProjectResponse = Awaited<
  ReturnType<MittwaldAPIClient["project"]["listProjects"]>
>;
type ProjectResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Projects.Get.Responses.$200.Content.ApplicationJson[number]
>;

export default class List extends GeneratedProjectListProjects<ProjectResponseItem> {
  protected mapData(
    data: SuccessfulResponse<ProjectResponse, 200>["data"],
  ): ProjectResponseItem[] {
    return data;
  }

  protected getColumns(
    ignoredData: ProjectResponseItem[],
  ): ListColumns<ProjectResponseItem> {
    const baseColumns = super.getColumns(ignoredData);
    return {
      id: baseColumns.id,
      shortId: {
        header: "Short ID",
        minWidth: 8,
      },
      customerId: {
        header: "Customer ID",
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
      createdAt: baseColumns.createdAt,
    };
  }
}
