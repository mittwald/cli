import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import { ListColumns } from "../../Formatter.js";
import { ListBaseCommand } from "../../ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Servers.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listServers"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List Servers for an Organization or User.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.project.listServers();
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(ignoredData: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(ignoredData);
    return {
      id: baseColumns.id,
      shortId: baseColumns.shortId,
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
          if (!row.isReady) {
            return "disabled";
          }
          return row.readiness;
        },
      },
      machineTypeName: {
        header: "Machine type",
        get: (row: any) => row.machineType.name,
      },
      machineTypeCpu: {
        header: "CPUs",
        get: (row: any) => row.machineType.cpu,
      },
      machineTypeMemory: {
        header: "Memory",
        get: (row: any) => row.machineType.memory,
      },
    };
  }
}
