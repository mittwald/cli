import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";

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
  static description = "List servers for an organization or user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.project.listServers();
  }

  protected getColumns(ignoredData: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, shortId } = super.getColumns(ignoredData);
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
          if (!row.isReady) {
            return "disabled";
          }
          return row.readiness;
        },
      },
      machineTypeName: {
        header: "Machine type",
        get: (row) => row.machineType.name,
      },
      machineTypeCpu: {
        header: "CPUs",
        get: (row) => row.machineType.cpu,
      },
      machineTypeMemory: {
        header: "Memory",
        get: (row) => row.machineType.memory,
      },
    };
  }
}
