import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import {
  projectFlags,
  withProjectId,
} from "../../../lib/resources/project/flags.js";

type BackupProjectBackupSchedule =
  MittwaldAPIV2.Components.Schemas.BackupProjectBackupSchedule;

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

  static aliases = ["project:backupschedule:list"];
  static deprecateAliases = true;

  public async getData(): Promise<Response> {
    const projectId = await withProjectId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.backup.listProjectBackupSchedules({
      projectId,
    } as Parameters<
      typeof this.apiClient.backup.listProjectBackupSchedules
    >[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id, createdAt } = super.getColumns(data);
    return {
      id,
      isSystemBackup: { header: "System backup" },
      schedule: {},
      ttl: { header: "TTL" },
      createdAt,
    };
  }
}
