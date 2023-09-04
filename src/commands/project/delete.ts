import { assertStatus } from "@mittwald/api-client-commons";
import { normalizeProjectIdToUuid } from "../../Helpers.js";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import { projectArgs, withProjectId } from "../../lib/project/flags.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a project";
  static resourceName = "project";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected async deleteResource(): Promise<void> {
    const projectId = await withProjectId(
      this.apiClient,
      Delete,
      {},
      this.args,
      this.config,
    );
    const response = await this.apiClient.project.deleteProject({
      projectId,
    });

    assertStatus(response, 200);
  }

  protected mapResourceId(id: string): Promise<string> {
    return normalizeProjectIdToUuid(this.apiClient, id);
  }
}
