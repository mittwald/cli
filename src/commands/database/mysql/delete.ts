import { assertStatus } from "@mittwald/api-client-commons";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";
import { Args } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a MySQL database";
  static resourceName = "MySQL database";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "database-id": Args.string({
      description: "ID of the MySQL database to delete.",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const response = await this.apiClient.database.deleteMysqlDatabase({
      pathParameters: { id: this.args["database-id"] },
    });

    assertStatus(response, 200);
  }

  protected mapResourceId(id: string): Promise<string> {
    return normalizeProjectIdToUuid(this.apiClient, id);
  }
}
