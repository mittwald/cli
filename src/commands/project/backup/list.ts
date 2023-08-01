import { Response, Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import BackupProjectBackup = MittwaldAPIV2.Components.Schemas.BackupProjectBackup;

type ListResponse = Response<BackupProjectBackup[]>;
type ListItem = Simplify<BackupProjectBackup>;

export class List extends ListBaseCommand<typeof List, ListItem, ListResponse> {
  static description = "List Backups for a given Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  protected mapData(
    data: SuccessfulResponse<ListResponse, 200>["data"],
  ): ListItem[] | Promise<ListItem[]> {
    return data;
  }

  public async getData(): Promise<ListResponse> {
    const projectId = await withProjectId(
      this.apiClient,
      this.flags,
      {},
      this.config,
    );
    return await this.apiClient.backup.listProjectBackups({
      pathParameters: { projectId },
    } as Parameters<typeof this.apiClient.backup.listProjectBackups>[0]);
  }

  protected getColumns(data: ListItem[]): ListColumns<ListItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      status: {},
      createdAt: baseColumns.createdAt,
      expiresIn: {
        header: "Expires in",
        get: (r) => formatRelativeDate(r.expiresAt),
      },
    };
  }
}
