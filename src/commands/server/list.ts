/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import {
  GeneratedProjectListServers,
  Response,
} from "../../generated/project/listServers.js";
import { ListColumns } from "../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Servers.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedProjectListServers<ResponseItem> {
  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(ignoredData: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(ignoredData);
    return {
      id: baseColumns.id,
      shortId: baseColumns.shortId,
      customerId: {
        header: "Customer ID",
        extended: true,
      },
      description: {
        header: "Description",
      },
      status: {
        header: "Status",
        get: (row) => {
          if (!row.isReady) {
            return "disabled";
          }
          return row.readiness;
        },
      },
      machineTypeName: {
        header: "Machine type",
        get: (row: any) => row.machineType.name,
      },
      machineTypeCpu: {
        header: "CPUs",
        get: (row: any) => row.machineType.cpu,
      },
      machineTypeMemory: {
        header: "Memory",
        get: (row: any) => row.machineType.memory,
      },
    };
  }
}
