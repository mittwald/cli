import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2SystemSoftwares.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listSystemsoftwares"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "Get all available dependencies";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.app.listSystemsoftwares({
      pathParameters: {},
    } as Parameters<typeof this.apiClient.app.listSystemsoftwares>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    data.sort(
      (a, b) =>
        a.tags[0].localeCompare(b.tags[0]) || a.name.localeCompare(b.name),
    );
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      name: {},
      tags: {
        get: (item) => item.tags.join(", "),
      },
    };
  }
}
