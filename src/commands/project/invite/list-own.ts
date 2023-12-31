import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectInvites.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listProjectInvites"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List all project invites for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.project.listProjectInvites();
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
      projectId: {
        header: "Project ID",
      },
      role: { header: "Role" },
    };
  }
}
