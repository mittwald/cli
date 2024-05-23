import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../../lib/resources/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMemberships.Get.Responses.$200.Content.ApplicationJson[number]
> & { user?: MittwaldAPIV2.Components.Schemas.UserUser };
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listMembershipsForProject"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List all memberships for a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.project.listMembershipsForProject({
      projectId,
    });
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return Promise.all(
      data.map(async (item) => {
        const out = structuredClone(item) as ResponseItem;
        const userResponse = await this.apiClient.user.getUser({
          userId: item.userId,
        });
        if (userResponse.status === 200) {
          out.user = userResponse.data;
        }
        return out;
      }),
    );
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
      userId: {
        header: "User ID",
        extended: true,
      },
      user: { header: "User", get: (row) => row.user?.email ?? "unknown" },
      role: { header: "Role" },
    };
  }
}
