import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";

export default class Uninstall extends DeleteBaseCommand<typeof Uninstall> {
  static description = "Uninstall an app";
  static resourceName = "app installation";

  static args = {
    "installation-id": Args.string({
      description: "ID of the app installation to delete",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const appInstallationId = this.args["installation-id"];
    const response = await this.apiClient.app.uninstallAppinstallation({
      appInstallationId,
    });

    assertStatus(response, 204);
  }
}
