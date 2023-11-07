import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/app/flags.js";

export default class Uninstall extends DeleteBaseCommand<typeof Uninstall> {
  static description = "Uninstall an app";
  static resourceName = "app installation";

  static args = {
    ...appInstallationArgs,
  };

  protected async deleteResource(): Promise<void> {
    const appInstallationId = await withAppInstallationId(
      this.apiClient,
      Uninstall,
      this.flags,
      this.args,
      this.config,
    );
    const response = await this.apiClient.app.uninstallAppinstallation({
      appInstallationId,
    });

    assertStatus(response, 204);
  }
}
