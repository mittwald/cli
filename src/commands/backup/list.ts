import { Response, Simplify } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import ListDateColumnFormatter from "../../rendering/formatter/ListDateColumnFormatter.js";

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

  public async getData(): Promise<ListResponse> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.backup.listProjectBackups({
      projectId,
    } as Parameters<typeof this.apiClient.backup.listProjectBackups>[0]);
  }

  protected getColumns(data: ListItem[]): ListColumns<ListItem> {
    const { id, createdAt } = super.getColumns(data);
    const dateColumnBuilder = new ListDateColumnFormatter(this.flags);
    return {
      id,
      status: {},
      createdAt,
      expiresIn: dateColumnBuilder.buildColumn({
        header: "Expires in",
        column: "expiresAt",
        fallback: "never",
      }),
    };
  }
}
