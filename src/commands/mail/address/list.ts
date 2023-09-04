/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { formatBytes } from "../../../lib/viewhelpers/size.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMailaddresses.Get.Responses.$200.Content.ApplicationJson[number]
>;

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMailaddresses.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["mailaddressList"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "Get all mail addresses for a project ID";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.mail.mailaddressList({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.mail.mailaddressList>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected async mapParams(input: PathParams): Promise<PathParams> {
    return {
      ...input,
      projectId: await withProjectId(
        this.apiClient,
        List,
        this.flags,
        this.args,
        this.config,
      ),
    };
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
        get: (r) => formatRelativeDate(r.updatedAt),
      },
    };
  }
}
