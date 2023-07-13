/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedProjectListInvitesForProject,
  PathParams,
  Response,
} from "../../../generated/project/listInvitesForProject.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdInvites.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedProjectListInvitesForProject<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
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
      },
      expires: {
        header: "Expires",
        extended: true,
        get: (row) => {
          if (!row.membershipExpiresAt) {
            return "never";
          }

          return formatDate(new Date(row.membershipExpiresAt));
        },
      },
      mailAddress: { header: "Email" },
      role: { header: "Role" },
    };
  }
}
