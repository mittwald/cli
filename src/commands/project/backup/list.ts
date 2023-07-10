/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ListColumns } from "../../../Formatter.js";
import { formatDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdBackups.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdBackups.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["backup"]["listProjectBackups"]>
>;

export class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List Backups for a given Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }

  public async getData(): Promise<Response> {
    const projectId = await withProjectId(this.apiClient, this.flags, {}, this.config);
    return await this.apiClient.backup.listProjectBackups({
      pathParameters: { projectId },
    } as Parameters<typeof this.apiClient.backup.listProjectBackups>[0]);
  }


  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      status: {},
      createdAt: baseColumns.createdAt,
      expiresIn: {
        header: "Expires in",
        get: r => formatDate(r.expiresAt)
      }
    }
  }
}
