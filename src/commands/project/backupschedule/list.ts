import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import BackupProjectBackupSchedule = MittwaldAPIV2.Components.Schemas.BackupProjectBackupSchedule;

type ResponseItem = Simplify<BackupProjectBackupSchedule>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["backup"]["listProjectBackupSchedules"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List backup schedules belonging to a given project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await withProjectId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.backup.listProjectBackupSchedules({
      pathParameters: { projectId },
    } as Parameters<typeof this.apiClient.backup.listProjectBackupSchedules>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
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
