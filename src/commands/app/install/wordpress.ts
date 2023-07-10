import { Flags, ux } from "@oclif/core";
import { BaseCommand } from "../../../BaseCommand.js";
import { getAppUuidFromAppName } from "../../../lib/app/appHelpers.js";
import {
  getLatestAvailableAppVersionForApp,
  getAppVersionUuidFromAppVersion,
} from "../../../lib/app/appVersionHelpers.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";

export default class AppCreateWordpress extends BaseCommand<
  typeof AppCreateWordpress
> {
  static description = "Creates new WordPress Installation.";

  static flags = {
    "project-id": Flags.string({
      char: "p",
      required: true,
      description: "ID of the Project, in which the App will be created.",
    }),
    version: Flags.string({
      required: false,
      description: "Version of the App to be created - Defaults to latest",
    }),
    host: Flags.string({
      required: true,
      description:
        "Host under which the App will be available (Needs to be created separately).",
    }),
    "admin-user": Flags.string({
      required: true,
      description: "First Admin User for the app.",
    }),
    "admin-email": Flags.string({
      required: true,
      description: "First Admin Users E-Mail.",
    }),
    "admin-pass": Flags.string({
      required: true,
      description: "First Admin Users Password.",
    }),
    "site-title": Flags.string({
      required: true,
      description: "Site Title of the created appInstallation.",
    }),
    wait: Flags.boolean({
      char: "w",
      description: "Wait for the App to be ready.",
    }),
  };

  public async run(): Promise<void> {
    ux.action.start("requesting installation for WordPress");

    const { flags } = await this.parse(AppCreateWordpress);
    const app = "WordPress";
    const appUuid: string = await getAppUuidFromAppName(this.apiClient, app);
    const projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      flags["project-id"],
    );
    let appVersion: MittwaldAPIV2.Components.Schemas.AppAppVersion | undefined;

    if (flags.version) {
      appVersion = await getAppVersionUuidFromAppVersion(
        this.apiClient,
        appUuid,
        flags.version,
      );
    } else {
      appVersion = await getLatestAvailableAppVersionForApp(
        this.apiClient,
        appUuid,
      );
    }

    if (!appVersion) {
      this.log("App Version ${flags.version} not found.");
      ux.exit(1);
    }

    const result = await this.apiClient.app.requestAppinstallation({
      pathParameters: { projectId },
      data: {
        appVersionId: appVersion.id,
        description: flags["site-title"],
        updatePolicy: "none",
        userInputs: [
          { name: "host", value: flags.host },
          { name: "site_title", value: flags["site-title"] },
          { name: "admin_user", value: flags["admin-user"] },
          { name: "admin_email", value: flags["admin-email"] },
          { name: "admin_pass", value: flags["admin-pass"] },
        ],
      },
    });

    assertStatus(result, 201);
    ux.action.stop("created");
    this.log(result.data.id);
  }
}
