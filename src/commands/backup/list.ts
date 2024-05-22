import { Response, Simplify } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/project/flags.js";
import { ListColumns } from "../../Formatter.js";
import { optionalDateRenderer } from "../../lib/viewhelpers/date.js";
import { makeDateRendererForFlags } from "../../lib/viewhelpers/list_column_date.js";

type BackupProjectBackup = MittwaldAPIV2.Components.Schemas.BackupProjectBackup;

type ListResponse = Response<BackupProjectBackup[]>;
type ListItem = Simplify<BackupProjectBackup>;

export class List extends ListBaseCommand<typeof List, ListItem, ListResponse> {
  static description = "List Backups for a given Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };
  static aliases = ["project:backup:list"];
  static deprecateAliases = true;

  protected mapData(
    data: SuccessfulResponse<ListResponse, 200>["data"],
  ): ListItem[] | Promise<ListItem[]> {
    return data;
  }

  public async getData(): Promise<ListResponse> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.backup.listProjectBackups({
      projectId,
    } as Parameters<typeof this.apiClient.backup.listProjectBackups>[0]);
  }

  protected getColumns(data: ListItem[]): ListColumns<ListItem> {
    const { id, createdAt } = super.getColumns(data);
    const dateRenderer = optionalDateRenderer(
      makeDateRendererForFlags(this.flags),
    );
    return {
      id,
      status: {},
      createdAt,
      expiresIn: {
        header: "Expires in",
        get: (r) => dateRenderer(r.expiresAt),
      },
    };
  }
}
