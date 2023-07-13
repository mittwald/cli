/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedProjectListProjectMemberships,
  Response,
} from "../../../generated/project/listProjectMemberships.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectMemberships.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedProjectListProjectMemberships<ResponseItem> {
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
