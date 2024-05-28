import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import ListDateColumnFormatter from "../../../rendering/formatter/ListDateColumnFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectMemberships.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listProjectMemberships"]>
>;

export default class ListOwn extends ListBaseCommand<
  typeof ListOwn,
  ResponseItem,
  Response
> {
  static description =
    "List ProjectMemberships belonging to the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.project.listProjectMemberships();
  }

  protected getColumns(): ListColumns<ResponseItem> {
    const dateColumnBuilder = new ListDateColumnFormatter(this.flags);
    const expires = dateColumnBuilder.buildColumn({
      header: "Expires",
      column: "expiresAt",
      fallback: "never",
      extended: true,
    });

    return {
      id: {
        header: "ID",
        minWidth: 36,
        extended: true,
      },
      expires,
      projectId: { header: "Project Id" },
      role: { header: "Role" },
    };
  }
}
