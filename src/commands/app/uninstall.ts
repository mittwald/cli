import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import { appInstallationArgs } from "../../lib/app/flags.js";

export default class Uninstall extends DeleteBaseCommand<typeof Uninstall> {
  static description = "Uninstall an app";
  static resourceName = "app installation";

  static args = {
    ...appInstallationArgs,
  };

  protected async deleteResource(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Uninstall);
    const response = await this.apiClient.app.uninstallAppinstallation({
      appInstallationId,
    });

    assertStatus(response, 204);
  }
}
