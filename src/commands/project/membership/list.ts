/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedProjectListMembershipsForProject,
  Response,
  PathParams,
} from "../../../generated/project/listMembershipsForProject.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMemberships.Get.Responses.$200.Content.ApplicationJson[number]
> & { user?: MittwaldAPIV2.Components.Schemas.UserUser };
export default class List extends GeneratedProjectListMembershipsForProject<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return Promise.all(
      data.map(async (item) => {
        const out = structuredClone(item) as ResponseItem;
        const userResponse = await this.apiClient.user.getUser({
          pathParameters: { userId: item.userId },
        });
        if (userResponse.status === 200) {
          out.user = userResponse.data;
        }
        return out;
      }),
    );
  }

  protected async mapParams(input: PathParams): Promise<PathParams> {
    input.projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      input.projectId,
    );
    return super.mapParams(input);
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

          return formatDate(new Date(row.expiresAt));
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
