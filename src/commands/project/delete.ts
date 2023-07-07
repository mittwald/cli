import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { normalizeProjectIdToUuid } from "../../Helpers.js";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a project";
  static resourceName = "project";

  static flags = {
    ...DeleteBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      required: true,
      description: "ID of the Project to be deleted.",
    }),
  };

  protected async deleteResource(): Promise<void> {
    const response = await this.apiClient.project.deleteProject({
      pathParameters: { projectId: this.args.id },
    });

    assertStatus(response, 200);
  }

  protected mapResourceId(id: string): Promise<string> {
    return normalizeProjectIdToUuid(this.apiClient, id);
  }
}
