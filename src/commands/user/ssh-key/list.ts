/* eslint-disable */
/* prettier-ignore */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedUserListSshKeys,
  Response,
} from "../../../generated/user/listSshKeys.js";
import { formatCreatedAt } from "../../../lib/viewhelpers/date.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  Required<MittwaldAPIV2.Paths.V2UsersSelfSshKeys.Get.Responses.$200.Content.ApplicationJson>["sshKeys"][number]
>;
export default class List extends GeneratedUserListSshKeys<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data.sshKeys ?? [];
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      sshKeyId: {
        header: "ID",
        minWidth: 36,
      },
      comment: {},
      fingerprint: {},
      created: {
        header: "Created at",
        get: formatCreatedAt,
      },
    };
  }
}
