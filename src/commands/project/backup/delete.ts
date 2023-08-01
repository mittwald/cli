import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { Args } from "@oclif/core";

export class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a backup";
  static resourceName = "backup";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "backup-id": Args.string({
      required: true,
      description: "The ID of the Backup to show.",
    }),
  };

  protected async deleteResource(): Promise<void> {
    const projectBackupId = this.args["backup-id"];
    const response = await this.apiClient.backup.deleteProjectBackup({
      pathParameters: { projectBackupId },
    });

    assertStatus(response, 204);
  }
}
