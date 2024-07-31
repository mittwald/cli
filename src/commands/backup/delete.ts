import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { backupArgs, withBackupId } from "../../lib/resources/backup/flags.js";

export class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a backup";
  static resourceName = "backup";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...backupArgs };
  static aliases = ["project:backup:delete"];
  static deprecateAliases = true;

  protected async deleteResource(): Promise<void> {
    const projectBackupId = await withBackupId(
      this.apiClient,
      Delete,
      this.flags,
      this.args,
      this.config,
    );
    const response = await this.apiClient.backup.deleteProjectBackup({
      projectBackupId,
    });

    assertStatus(response, 204);
  }
}
