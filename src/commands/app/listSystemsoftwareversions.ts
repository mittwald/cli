/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedAppListSystemsoftwareversions,
  Response,
} from "../../generated/app/listSystemsoftwareversions.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2SystemsoftwareSystemSoftwareIdVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedAppListSystemsoftwareversions<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
