import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import { projectArgs } from "../../lib/project/flags.js";
import assertSuccess from "../../lib/assert_success.js";

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

    assertSuccess(response);
  }
}
