import { Flags, ux } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { BaseCommand } from "../../BaseCommand.js";
import { normalizeProjectIdToUuid } from "../../Helpers.js";
import { getAppNameFromUuid, getAppVersionFromUuid } from "../../Translator.js";
import { projectFlags, withProjectId } from "../../lib/project/flags.js";

export default class List extends BaseCommand {
  static description = "List projects";
  static flags = {
    ...ux.table.flags(),
    ...projectFlags,
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(List);
    const projectId = await withProjectId(
      this.apiClient,
      flags,
      {},
      this.config,
    );

    const apps = await this.apiClient.app.listAppinstallations({
      pathParameters: { projectId },
    });
    assertStatus(apps, 200);

    if (flags.json) {
      this.logJson(apps.data);
      return;
    }

    const relevantAppInfo = await Promise.all(
      apps.data.map(async (app) => {
        return {
          id: app.id,
          description: app.description,
          app: await getAppNameFromUuid(this.apiClient, app.appId),
          appVersion: await getAppVersionFromUuid(
            this.apiClient,
            app.appId,
            app.appVersion.current as string,
          ),
          installPath: app.installationPath,
        };
      }),
    );

    ux.table(
      relevantAppInfo,
      {
        id: {
          header: "ID",
          minWidth: 36,
        },
        description: {
          header: "Description",
          minWidth: 36,
        },
        app: {
          header: "Application",
          minWidth: 8,
        },
        appVersion: {
          header: "Version",
          minWidth: 8,
        },
        installPath: {
          header: "InstallDir",
          minWidth: 12,
        },
      },
      {
        printLine: this.log.bind(this),
        ...flags,
      },
    );
  }
}
