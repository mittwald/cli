/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedConversationListConversations,
  Response,
} from "../../generated/conversation/listConversations.js";
import { ListColumns } from "../../Formatter.js";
import { formatRelativeDate } from "../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Conversations.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedConversationListConversations<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      conversationId: {
        header: "ID",
        minWidth: 36,
        extended: true,
      },
      shortId: {
        header: "Short ID",
        minWidth: 8,
      },
      status: {},
      title: {},
      created: {
        header: "Created",
        get: (row) =>
          formatRelativeDate(new Date(`${row.createdAt}`)) +
          " by " +
          (row.createdBy ? row.createdBy.clearName : "unknown"),
      },
    };
  }
}
