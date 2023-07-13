/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../../types.js";
import {
  GeneratedCronjobListExecutions,
  Response,
} from "../../../../generated/cronjob/listExecutions.js";
import { ListColumns } from "../../../../Formatter.js";
import { formatRelativeDate } from "../../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CronjobsCronjobIdExecutions.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedCronjobListExecutions<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      id: {},
      status: {},
      duration: {
        get: (r) =>
          r.durationInMilliseconds
            ? Math.round(r.durationInMilliseconds / 1000) + "s"
            : "",
      },
      started: {
        get: (r) => formatRelativeDate(r.executionStart),
      },
      ended: {
        get: (r) => formatRelativeDate(r.executionEnd),
      },
    };
  }
}
