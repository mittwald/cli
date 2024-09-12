import { assertStatus } from "@mittwald/api-client-commons";
import open from "open";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/resources/app/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import buildAppURLsFromIngressList from "../../lib/resources/app/buildAppURLsFromIngressList.js";

export class Open extends ExtendedBaseCommand<typeof Open> {
  static summary = "Open an app installation in the browser.";
  static description =
    "This command opens an app installation in the browser. For this to work, there needs to be at least one virtual host linked to the app installation.";

  static args = { ...appInstallationArgs };

  public async run(): Promise<void> {
    const appInstallationId = await withAppInstallationId(
      this.apiClient,
      Open,
      this.flags,
      this.args,
      this.config,
    );
    const installation = await this.apiClient.app.getAppinstallation({
      appInstallationId,
    });
    assertStatus(installation, 200);

    const domains = await this.apiClient.domain.ingressListIngresses({
      queryParameters: {
        projectId: installation.data.projectId,
      },
    });
    assertStatus(domains, 200);

    const urls = buildAppURLsFromIngressList(
      domains.data,
      installation.data.id,
    );
    if (urls.length === 0) {
      throw new Error(
        "This app installation is not linked to any virtual hosts.",
      );
    }

    console.log("opening " + urls[0]);
    await open(urls[0]);
  }
}
