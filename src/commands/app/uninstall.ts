import { assertStatus } from "@mittwald/api-client-commons";
import axios from "axios";
import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import { appInstallationArgs } from "../../lib/resources/app/flags.js";

/**
 * Maps an error raised while uninstalling an app installation to a more
 * actionable one. The API answers with an HTTP 412 (Precondition Failed) when
 * the app still has a linked _primary_ database; in that case we surface a
 * clear hint instead of a raw Axios error. All other errors are passed through
 * unchanged so they are not accidentally swallowed.
 */
export function mapUninstallError(err: unknown): unknown {
  if (axios.isAxiosError(err) && err.response?.status === 412) {
    return new Error(
      "cannot uninstall: app has a linked primary database — " +
        "unlink or repurpose it first (a primary database must be " +
        "repurposed to custom or cache before it can be unlinked)",
      { cause: err },
    );
  }

  return err;
}

export default class Uninstall extends DeleteBaseCommand<typeof Uninstall> {
  static description = "Uninstall an app";
  static resourceName = "app installation";

  static args = {
    ...appInstallationArgs,
  };

  protected async deleteResource(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Uninstall);

    try {
      const response = await this.apiClient.app.uninstallAppinstallation({
        appInstallationId,
      });

      assertStatus(response, 204);
    } catch (err) {
      throw mapUninstallError(err);
    }
  }
}
