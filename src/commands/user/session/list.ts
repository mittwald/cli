/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { GeneratedUserListSessions, Response } from "../../../generated/user/listSessions.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2SignupSessions.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedUserListSessions<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      tokenId: { header: "ID", minWidth: 36 },
      device: {
        header: "Device",
        get: (row) => `${row.device.browser} on ${row.device.os}`,
      },
      location: {
        header: "Location",
        get: (row) => row.location?.country,
      },
      lastAccess: {
        header: "Last Access",
        get: (row) =>
          row.lastAccess ? formatDate(new Date(`${row.lastAccess}`)) : "never",
      },
    };
  }
}
