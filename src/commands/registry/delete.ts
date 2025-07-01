import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { Args } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a container registry";
  static resourceName = "container registry";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "registry-id": Args.string({
      description: "The ID of the container registry to delete",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const registryId = this.args["registry-id"];
    const response = await this.apiClient.container.deleteRegistry({
      registryId,
    });

    assertSuccess(response);
  }
}
