import {
  assertStatus,
  MittwaldAPIV2,
  MittwaldAPIV2Client,
} from "@mittwald/api-client";
import { DDEVConfig, DDEVDatabaseConfig } from "./config.js";
import AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
import AppLinkedDatabase = MittwaldAPIV2.Components.Schemas.AppLinkedDatabase;
import { typo3Installer } from "../../commands/app/install/typo3.js";
import { wordpressInstaller } from "../../commands/app/install/wordpress.js";
import { shopware6Installer } from "../../commands/app/install/shopware6.js";
import { drupalInstaller } from "../../commands/app/install/drupal.js";

type SystemSoftwareVersions = Record<string, string>;

export class DDEVConfigBuilder {
  private apiClient: MittwaldAPIV2Client;

  public constructor(apiClient: MittwaldAPIV2Client) {
    this.apiClient = apiClient;
  }

  public async build(
    appInstallationId: string,
    type: string,
  ): Promise<Partial<DDEVConfig>> {
    const output: Partial<DDEVConfig> = {};

    const appInstallation = await this.withAppInstallation(appInstallationId);
    const systemSoftwares = await this.buildSystemSoftwareVersionMap(
      appInstallation,
    );

    output["type"] = await this.determineProjectType(appInstallation, type);
    output["override_config"] = true;
    output["webserver_type"] = "apache-fpm";
    output["php_version"] = this.determinePHPVersion(systemSoftwares);
    output["database"] = await this.determineDatabaseVersion(appInstallation);
    output["docroot"] = await this.determineDocumentRoot(appInstallation);
    output["web_environment"] = [
      `MITTWALD_APP_INSTALLATION_ID=${appInstallation.shortId}`,
    ];

    return output;
  }

  private async determineDocumentRoot(
    inst: AppAppInstallation,
  ): Promise<string> {
    const appVersion = await this.getAppVersion(
      inst.appId,
      inst.appVersion.desired,
    );

    if (
      appVersion.docRootUserEditable &&
      inst.customDocumentRoot !== undefined
    ) {
      return inst.customDocumentRoot.replace(/^\//, "");
    }

    return appVersion.docRoot.replace(/^\//, "");
  }

  private async determineProjectType(
    inst: AppAppInstallation,
    type: string,
  ): Promise<string> {
    if (type !== "auto") {
      return type;
    }

    if (inst.appId === typo3Installer.appId) {
      return "typo3";
    }

    if (inst.appId === wordpressInstaller.appId) {
      return "wordpress";
    }

    if (inst.appId === shopware6Installer.appId) {
      return "shopware6";
    }

    if (inst.appId === drupalInstaller.appId) {
      const version = await this.getAppVersion(
        inst.appId,
        inst.appVersion.desired,
      );

      const [major] = version.externalVersion.split(".");
      return `drupal${major}`;
    }

    throw new Error(
      "Automatic project type detection failed. Please specify the project type manually by setting the `--override-type` flag.",
    );
  }

  private async determineDatabaseVersion(
    inst: AppAppInstallation,
  ): Promise<DDEVDatabaseConfig | undefined> {
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

  private async getAppVersion(
    appId: string,
    appVersionId: string,
  ): Promise<AppAppVersion> {
    const r = await this.apiClient.app.getAppversion({
      appId,
      appVersionId,
    });

    assertStatus(r, 200);
    return r.data;
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
