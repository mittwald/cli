import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";

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

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: {
        header: "ID",
        minWidth: 36,
        extended: true,
      },
      expires: {
        header: "Expires",
        extended: true,
        get: (row) => {
          if (!row.expiresAt) {
            return "never";
          }

          return formatRelativeDate(new Date(row.expiresAt));
        },
      },
      projectId: { header: "Project Id" },
      role: { header: "Role" },
    };
  }
}
