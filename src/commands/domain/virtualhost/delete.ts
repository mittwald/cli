import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";
import { Args } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a virtual host";
  static resourceName = "virtual host";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "virtual-host-id": Args.string({
      description: "ID of the virtual host to delete",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const ingressId = this.args["virtual-host-id"];
    const response = await this.apiClient.domain.ingressDeleteIngress({
      ingressId,
    });

    assertStatus(response, 204);
  }
}
