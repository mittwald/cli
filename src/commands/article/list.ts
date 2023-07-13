/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import { GeneratedArticleListArticles, Response } from "../../generated/article/listArticles.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Articles.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedArticleListArticles<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
