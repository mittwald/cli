import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import { projectArgs } from "../../lib/project/flags.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a project";
  static resourceName = "project";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected async deleteResource(): Promise<void> {
    const projectId = await this.withProjectId(Delete);
    const response = await this.apiClient.project.deleteProject({
      projectId,
    });

    assertStatus(response, 200);
  }
}
