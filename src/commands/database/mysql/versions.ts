/* eslint-disable */
/* prettier-ignore */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { GeneratedDatabaseListMysqlVersions, Response } from "../../../generated/database/listMysqlVersions.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2MysqlVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedDatabaseListMysqlVersions<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
