import {
  MittwaldAPIV2,
  MittwaldAPIV2Client,
  assertStatus,
} from "@mittwald/api-client";
import { DDEVConfig } from "./config.js";
import AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
import AppLinkedDatabase = MittwaldAPIV2.Components.Schemas.AppLinkedDatabase;

type SystemSoftwareVersions = Record<string, string>;

export class DDEVConfigBuilder {
  private apiClient: MittwaldAPIV2Client;

  public constructor(apiClient: MittwaldAPIV2Client) {
    this.apiClient = apiClient;
  }

  public async build(appInstallationId: string): Promise<Partial<DDEVConfig>> {
    const output: Partial<DDEVConfig> = {};

    const appInstallation = await this.withAppInstallation(appInstallationId);
    const systemSoftwares = await this.buildSystemSoftwareVersionMap(
      appInstallation,
    );

    output["override_config"] = true;
    output["webserver_type"] = "apache-fpm";
    output["php_version"] = this.determinePHPVersion(systemSoftwares);
    output["web_environment"] = [
      `MITTWALD_APP_INSTALLATION_ID=${appInstallation.shortId}`,
    ];

    const database = await this.determineDatabaseVersion(appInstallation);
    if (database) {
      output["database"] = database;
    }

    if (appInstallation.customDocumentRoot) {
      output["docroot"] = appInstallation.customDocumentRoot;
    }

    return output;
  }

  private async determineDatabaseVersion(inst: AppAppInstallation): Promise<
    | {
        type: string;
        version: string;
      }
    | undefined
  > {
    const isPrimary = (db: AppLinkedDatabase) => db.purpose === "primary";
    const primary = (inst.linkedDatabases || []).find(isPrimary);

    if (primary?.kind === "mysql") {
      const r = await this.apiClient.database.getMysqlDatabase({
        mysqlDatabaseId: primary.databaseId,
      });
      assertStatus(r, 200);

      return {
        type: "mysql",
        version: r.data.version,
      };
    }

    return undefined;
  }

  private determinePHPVersion(
    systemSoftwareVersions: SystemSoftwareVersions,
  ): string | undefined {
    if (!("php" in systemSoftwareVersions)) {
      return undefined;
    }

    const version = systemSoftwareVersions["php"];
    const [major, minor] = version.split(".");

    return `${major}.${minor}`;
  }

  private async buildSystemSoftwareVersionMap(
    inst: AppAppInstallation,
  ): Promise<SystemSoftwareVersions> {
    const versionMap: SystemSoftwareVersions = {};

    for (const {
      systemSoftwareId,
      systemSoftwareVersion,
    } of inst.systemSoftware || []) {
      const systemSoftwareResponse = await this.apiClient.app.getSystemsoftware(
        {
          systemSoftwareId,
        },
      );
      assertStatus(systemSoftwareResponse, 200);

      const systemSoftwareVersionResponse =
        await this.apiClient.app.getSystemsoftwareversion({
          systemSoftwareId,
          systemSoftwareVersionId: systemSoftwareVersion.desired,
        });
      assertStatus(systemSoftwareVersionResponse, 200);

      const systemSoftware = systemSoftwareResponse.data;
      const version = systemSoftwareVersionResponse.data;

      versionMap[systemSoftware.name] = version.externalVersion;
    }

    return versionMap;
  }

  private async withAppInstallation(
    appInstallationId: string,
  ): Promise<AppAppInstallation> {
    const r = await this.apiClient.app.getAppinstallation({
      appInstallationId,
    });

    assertStatus(r, 200);
    return r.data;
  }
}
