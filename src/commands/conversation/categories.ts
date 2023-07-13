/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedConversationListCategories,
  Response,
} from "../../generated/conversation/listCategories.js";
import { ListColumns } from "../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ConversationCategories.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class Categories extends GeneratedConversationListCategories<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      id: {
        header: "ID",
        minWidth: 36,
        extended: true,
      },
      name: {},
    };
  }
}
