/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedDomainListToplevelDomains,
  Response,
} from "../../generated/domain/listToplevelDomains.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ToplevelDomains.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedDomainListToplevelDomains<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
