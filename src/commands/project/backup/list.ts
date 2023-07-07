/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedBackupListProjectBackups,
  Response,
  PathParams,
} from "../../../generated/backup/listProjectBackups.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdBackups.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedBackupListProjectBackups<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
  protected async mapParams(input: PathParams): Promise<PathParams> {
    input.projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      input.projectId,
    );
    return super.mapParams(input);
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      status: {},
      createdAt: baseColumns.createdAt,
      expiresAt: {
        header: "Expires in",
        get: (r) =>
          r.expiresAt ? formatDate(new Date(`${r.expiresAt}`)) : "never",
      },
    };
  }
}
