/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedCronjobListCronjobs,
  Response,
} from "../../../generated/cronjob/listCronjobs.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedCronjobListCronjobs<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      shortId: baseColumns.shortId,
      interval: {},
      description: {},
      lastExecution: {
        header: "Last execution",
        get: (r) => {
          if (!r.latestExecution) {
            return "-";
          }
          return (
            r.latestExecution.status +
            ", " +
            formatDate((r.latestExecution as any).start)
          ); // API specs are broken
        },
      },
      createdAt: baseColumns.createdAt,
    };
  }
}
