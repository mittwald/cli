/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { GeneratedUserListApiTokens, Response } from "../../../generated/user/listApiTokens.js";
import { ListColumns } from "../../../Formatter.js";
import { formatCreatedAt, formatDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2SignupTokenApi.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedUserListApiTokens<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
  protected getColumns(): ListColumns<ResponseItem> {
    return {
      apiTokenId: { header: "ID", minWidth: 36 },
      description: {},
      createdAt: {
        header: "Created at",
        get: formatCreatedAt,
      },
      expiresAt: {
        header: "Expires at",
        get: (r) =>
          r.expiresAt ? formatDate(new Date(`${r.expiresAt}`)) : "never",
      },
    };
  }
}
