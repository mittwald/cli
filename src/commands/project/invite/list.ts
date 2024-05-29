import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../../lib/resources/project/flags.js";
import ListDateColumnFormatter from "../../../rendering/formatter/ListDateColumnFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdInvites.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listInvitesForProject"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List all invites belonging to a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.project.listInvitesForProject({ projectId });
  }

  protected getColumns(): ListColumns<ResponseItem> {
    const dateColumnBuilder = new ListDateColumnFormatter(this.flags);
    const expires = {
      ...dateColumnBuilder.buildColumn({
        header: "Expires",
        fallback: "(never)",
        column: "membershipExpiresAt",
      }),
      extended: true,
    };

    return {
      id: {
        header: "ID",
        minWidth: 36,
      },
      expires,
      mailAddress: { header: "Email" },
      role: { header: "Role" },
    };
  }
}
