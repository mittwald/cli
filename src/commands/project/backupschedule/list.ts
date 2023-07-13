/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedBackupListProjectBackupSchedules,
  Response,
} from "../../../generated/backup/listProjectBackupSchedules.js";
import { PathParams } from "../../../generated/backup/listProjectBackups.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdBackupSchedules.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedBackupListProjectBackupSchedules<ResponseItem> {
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
      isSystemBackup: { header: "System backup" },
      schedule: {},
      ttl: { header: "TTL" },
      createdAt: baseColumns.createdAt,
    };
  }
}
