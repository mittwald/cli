import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../../lib/project/flags.js";

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

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: {
        header: "ID",
        minWidth: 36,
      },
      expires: {
        header: "Expires",
        extended: true,
        get: (row) => {
          if (!row.membershipExpiresAt) {
            return "never";
          }

          return formatRelativeDate(new Date(row.membershipExpiresAt));
        },
      },
      mailAddress: { header: "Email" },
      role: { header: "Role" },
    };
  }
}
