import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { formatRelativeDate } from "../../../rendering/textformat/formatDate.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../../lib/resources/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDeliveryBoxes.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDeliveryBoxes.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["listDeliveryBoxes"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "Get all delivery boxes by project ID";

  static args = {};
  static flags = {
    ...projectFlags,
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return this.apiClient.mail.listDeliveryBoxes({ projectId });
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      name: {},
      description: {},
      updatedAt: {
        header: "Updated at",
        get: (r) => formatRelativeDate(r.updatedAt),
      },
    };
  }
}
