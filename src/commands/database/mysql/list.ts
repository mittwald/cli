/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { GeneratedDatabaseListMysqlDatabases, Response } from "../../../generated/database/listMysqlDatabases.js";
import { ListColumns } from "../../../Formatter.js";
import { formatBytes } from "../../../lib/viewhelpers/size.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMysqlDatabases.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedDatabaseListMysqlDatabases<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(ignoredData: ResponseItem[]): ListColumns<ResponseItem> {
    const commonColumns = super.getColumns(ignoredData);
    return {
      ...commonColumns,
      name: {
        header: "name",
        minWidth: 12,
      },
      version: {
        header: "version",
      },
      description: {
        header: "description",
      },
      hostname: {
        header: "hostname",
      },
      status: {
        header: "Status",
        get: (row) => {
          if (!row.isReady) {
            return "pending";
          }
          return "ready";
        },
      },
      isShared: {
        header: "isShared",
        extended: true,
      },
      characterSet: {
        header: "Charset",
        get: (row) => row.characterSettings?.characterSet,
        extended: true,
      },
      collation: {
        header: "Collation",
        get: (row) => row.characterSettings?.collation,
        extended: true,
      },
      size: {
        header: "size",
        // there is an error in the API mapping
        get: (row) => formatBytes((row.size as unknown as { low: number }).low),
      },
    };
  }
}
