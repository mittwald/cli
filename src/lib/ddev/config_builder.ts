import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import {
  DDEVConfig,
  DDEVDatabaseConfig,
  DDEVHook,
  DDEVHooks,
} from "./config.js";
import { typo3Installer } from "../../commands/app/install/typo3.js";
import { wordpressInstaller } from "../../commands/app/install/wordpress.js";
import { shopware6Installer } from "../../commands/app/install/shopware6.js";
import { drupalInstaller } from "../../commands/app/install/drupal.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type LinkedDatabase = MittwaldAPIV2.Components.Schemas.AppLinkedDatabase;
type SystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;
type SystemSoftwareVersion =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
type AppInstallationWithDocRoot = AppInstallation & {
  customDocumentRoot: string;
};

type SystemSoftwareVersions = Record<string, string>;

export class DDEVConfigBuilder {
  private apiClient: MittwaldAPIV2Client;

  public constructor(apiClient: MittwaldAPIV2Client) {
    this.apiClient = apiClient;
  }

  public async build(
    appInstallationId: string,
    databaseId: string | undefined,
    type: string,
  ): Promise<Partial<DDEVConfig>> {
    const appInstallation = await this.getAppInstallation(appInstallationId);
    const systemSoftwares =
      await this.buildSystemSoftwareVersionMap(appInstallation);

    type = await this.determineProjectType(appInstallation, type);

    return {
      type,
      webserver_type: "apache-fpm",
      php_version: this.determinePHPVersion(systemSoftwares),
      database: await this.determineDatabaseVersion(databaseId),
      docroot: await this.determineDocumentRoot(appInstallation),
      web_environment: [
        `MITTWALD_APP_INSTALLATION_ID=${appInstallation.shortId}`,
        `MITTWALD_DATABASE_ID=${databaseId ?? ""}`,
      ],
      hooks: this.buildHooks(type),
    };
  }

  private buildHooks(type: string): DDEVHooks | undefined {
    const postPull: DDEVHook[] = [
      { "exec-host": "ddev config --project-name $DDEV_PROJECT" },
      { "exec-host": "ddev restart" },
    ];

    if (type === "typo3") {
      postPull.push(
        { exec: "typo3 cache:flush" },
        { exec: "typo3 cache:warmup" },
      );
    }

    if (type === "wordpress") {
      postPull.push({ exec: "wp cache flush" });
    }

    if (type === "shopware6") {
      postPull.push({ exec: "bin/console cache:clear" });
    }

    return {
      "post-pull": postPull,
    };
  }

  private async determineDocumentRoot(inst: AppInstallation): Promise<string> {
    const appVersion = await this.getAppVersion(
      inst.appId,
      inst.appVersion.desired,
    );

    if (appVersion.docRootUserEditable && hasCustomDocumentRoot(inst)) {
      return stripLeadingSlash(inst.customDocumentRoot);
    }

    return stripLeadingSlash(appVersion.docRoot);
  }

  private async determineProjectType(
    inst: AppInstallation,
    type: string,
  ): Promise<string> {
    if (type !== "auto") {
      return type;
    }

    switch (inst.appId) {
      case typo3Installer.appId:
        return "typo3";
      case wordpressInstaller.appId:
        return "wordpress";
      case shopware6Installer.appId:
        return "shopware6";
      case drupalInstaller.appId: {
        const version = await this.getAppVersion(
          inst.appId,
          inst.appVersion.desired,
        );

        const [major] = version.externalVersion.split(".");
        return `drupal${major}`;
      }
      default:
        throw new Error(
          "Automatic project type detection failed. Please specify the project type manually by setting the `--override-type` flag.",
        );
    }
  }

  private async determineDatabaseVersion(
    databaseId: string | undefined,
  ): Promise<DDEVDatabaseConfig | undefined> {
    if (!databaseId) {
      return undefined;
    }

    const mysqlDatabase = await this.determineMySQLDatabaseVersion(databaseId);
    if (mysqlDatabase) {
      return mysqlDatabase;
    }

    return undefined;
  }

  private async determineMySQLDatabaseVersion(
    mysqlDatabaseId: string,
  ): Promise<DDEVDatabaseConfig | undefined> {
    const r = await this.apiClient.database.getMysqlDatabase({
      mysqlDatabaseId,
    });

    if (r.status !== 200) {
      return undefined;
    }

    return {
      type: "mysql",
      version: r.data.version,
    };
  }

  private async determineDatabaseVersionFromInstallation(
    inst: AppInstallation,
  ): Promise<DDEVDatabaseConfig | undefined> {
    const isPrimary = (db: LinkedDatabase) => db.purpose === "primary";
    const primary = (inst.linkedDatabases || []).find(isPrimary);

    if (primary?.kind === "mysql") {
      return this.determineMySQLDatabaseVersion(primary.databaseId);
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
    return stripPatchLevelVersion(version);
  }

  private async buildSystemSoftwareVersionMap(
    inst: AppInstallation,
  ): Promise<SystemSoftwareVersions> {
    const versionMap: SystemSoftwareVersions = {};

    for (const {
      systemSoftwareId,
      systemSoftwareVersion,
    } of inst.systemSoftware || []) {
      const { name } = await this.getSystemSoftware(systemSoftwareId);
      const { externalVersion } = await this.getSystemSoftwareVersion(
        systemSoftwareId,
        systemSoftwareVersion.desired,
      );

      versionMap[name] = externalVersion;
    }

    return versionMap;
  }

  private async getSystemSoftware(
    systemSoftwareId: string,
  ): Promise<SystemSoftware> {
    const systemSoftwareResponse = await this.apiClient.app.getSystemsoftware({
      systemSoftwareId,
    });
    assertStatus(systemSoftwareResponse, 200);
    return systemSoftwareResponse.data;
  }

  private async getSystemSoftwareVersion(
    systemSoftwareId: string,
    systemSoftwareVersionId: string,
  ): Promise<SystemSoftwareVersion> {
    const r = await this.apiClient.app.getSystemsoftwareversion({
      systemSoftwareId,
      systemSoftwareVersionId,
    });

    assertStatus(r, 200);
    return r.data;
  }

  private async getAppVersion(
    appId: string,
    appVersionId: string,
  ): Promise<AppVersion> {
    const r = await this.apiClient.app.getAppversion({
      appId,
      appVersionId,
    });

    assertStatus(r, 200);
    return r.data;
  }

  private async getAppInstallation(
    appInstallationId: string,
  ): Promise<AppInstallation> {
    const r = await this.apiClient.app.getAppinstallation({
      appInstallationId,
    });

    assertStatus(r, 200);
    return r.data;
  }
}

function hasCustomDocumentRoot(
  inst: AppInstallation,
): inst is AppInstallationWithDocRoot {
  return inst.customDocumentRoot !== undefined;
}

function stripLeadingSlash(input: string): string {
  return input.replace(/^\//, "");
}

function stripPatchLevelVersion(version: string): string {
  const [major, minor] = version.split(".");
  return `${major}.${minor}`;
}
