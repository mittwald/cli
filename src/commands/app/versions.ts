import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { Args } from "@oclif/core";
import { isUuid } from "../../normalize_id.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import {
  getAppNameFromUuid,
  getAppUuidFromAppName,
} from "../../lib/resources/app/uuid.js";

export default class AppVersions extends BaseCommand {
  static description = "List supported Apps and Versions";
  static args = {
    app: Args.string({
      description: "name of specific app to get versions for",
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(AppVersions);

    const AppUuidsToGetVersionsFor = args.app
      ? await this.getApp(this.apiClient, args.app)
      : await this.getAllApps(this.apiClient);

    for (const appUuid of AppUuidsToGetVersionsFor) {
      console.log(
        `Available ${await getAppNameFromUuid(
          this.apiClient,
          appUuid,
        )} Versions:`,
      );
      await this.outputVersionsForAppUuid(this.apiClient, appUuid);
      console.log("");
    }
  }

  protected async getApp(
    apiClient: MittwaldAPIV2Client,
    appId: string,
  ): Promise<string[]> {
    let appUuid: string;
    if (isUuid(appId)) {
      appUuid = appId;
    } else {
      appUuid = await getAppUuidFromAppName(apiClient, appId);
    }
    return [appUuid];
  }

  protected async getAllApps(
    apiClient: MittwaldAPIV2Client,
  ): Promise<string[]> {
    const apps = await apiClient.app.listApps();
    assertStatus(apps, 200);

    const appUuids: string[] = [];

    for (const app of apps.data) {
      appUuids.push(app.id);
    }

    return appUuids;
  }

  protected async outputVersionsForAppUuid(
    apiClient: MittwaldAPIV2Client,
    appUuid: string,
  ): Promise<void> {
    const versions = await apiClient.app.listAppversions({
      appId: appUuid,
    });
    assertStatus(versions, 200);
    for (const version of versions.data) {
      console.log(version.externalVersion);
    }
  }
}
