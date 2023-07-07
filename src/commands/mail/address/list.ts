/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import {
  GeneratedMailMailaddressList,
  Response,
  PathParams,
} from "../../../generated/mail/mailaddressList.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";
import { formatBytes } from "../../../lib/viewhelpers/size.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMailaddresses.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class List extends GeneratedMailMailaddressList<ResponseItem> {
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
      address: {},
      forward: {
        header: "Forwarded to",
        get: (r) => {
          if (r.forwardAddresses.length === 0) {
            return "n/a";
          }

          if (r.forwardAddresses.length === 1) {
            return r.forwardAddresses[0];
          }

          return r.forwardAddresses[0] + " +" + (r.forwardAddresses.length - 1);
        },
      },
      usage: {
        header: "Usage",
        get: (r) => {
          if (!r.mailbox?.storageInBytes.current) {
            return "unknown";
          }
          return (
            formatBytes(r.mailbox?.storageInBytes.current.value) +
            " of " +
            formatBytes(r.mailbox?.storageInBytes.limit)
          );
        },
      },
      updatedAt: {
        header: "Updated at",
        get: (r) => formatDate(r.updatedAt),
      },
    };
  }
}
