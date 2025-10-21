import { assertStatus } from "@mittwald/api-client-commons";
import open from "open";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/resources/app/flags.js";
import { ExtendedBaseCommand } from "../../lib/basecommands/ExtendedBaseCommand.js";
import buildAppURLsFromIngressList from "../../lib/resources/app/buildAppURLsFromIngressList.js";
import { Flags } from "@oclif/core";

export class Open extends ExtendedBaseCommand<typeof Open> {
  static summary = "Open an app installation in the browser.";
  static description =
    "This command opens an app installation in the browser. For this to work, there needs to be at least one virtual host linked to the app installation.";

  static args = { ...appInstallationArgs };
  static flags = {
    backend: Flags.boolean({
      summary: "open the backend of the app installation",
      description:
        "If this flag is set, the backend of the app installation will be opened instead of the frontend. This flag is only available for some types of apps (like PHP and Node.js).",
      default: false,
      required: false,
    }),
  };

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

    const [appVersion, domains] = await Promise.all([
      (async () => {
        const appVersion = await this.apiClient.app.getAppversion({
          appId: installation.data.appId,
          appVersionId: installation.data.appVersion.desired,
        });
        assertStatus(appVersion, 200);
        return appVersion.data;
      })(),
      (async () => {
        const domains = await this.apiClient.domain.ingressListIngresses({
          queryParameters: {
            projectId: installation.data.projectId,
          },
        });
        assertStatus(domains, 200);
        return domains.data;
      })(),
    ]);

    const urls = buildAppURLsFromIngressList(domains, installation.data.id);
    if (urls.length === 0) {
      throw new Error(
        "This app installation is not linked to any virtual hosts.",
      );
    }

    let url = urls[0];
    if (this.flags.backend && appVersion.backendPathTemplate) {
      url = appVersion.backendPathTemplate.replace(
        "{domain}",
        url.replace(/\/$/, ""),
      );
    }

    console.log("opening " + url);
    await open(url);
  }
}
