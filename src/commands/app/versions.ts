import { BaseCommand } from "../../lib/basecommands/BaseCommand.js";
import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { validate as validateUuid } from "uuid";
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

    const appUuidsToGetVersionsFor = args.app
      ? [await this.getApp(this.apiClient, args.app)]
      : await this.getAllApps(this.apiClient);

    for (const appUuid of appUuidsToGetVersionsFor) {
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
  ): Promise<string> {
    return validateUuid(appId)
      ? appId
      : await getAppUuidFromAppName(apiClient, appId);
  }

  protected async getAllApps(
    apiClient: MittwaldAPIV2Client,
  ): Promise<string[]> {
    const apps = await apiClient.app.listApps();
    assertStatus(apps, 200);

    return apps.data.map((app) => app.id);
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
