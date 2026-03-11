/* eslint-disable camelcase */

import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { assertStatus, MittwaldAPIV2Client } from "@mittwald/api-client";
import {
  DDEVConfig,
  DDEVDatabaseConfig,
  DDEVHook,
  DDEVHooks,
} from "./config.js";
import { determineProjectTypeFromAppInstallation } from "./init_projecttype.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type SystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;
type SystemSoftwareVersion =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
type AppInstallationWithDocRoot = AppInstallation & {
  customDocumentRoot: string;
};

type SystemSoftwareVersions = Record<string, string>;

export type DDEVConfigBuildResult = {
  config: Partial<DDEVConfig>;
  warnings: string[];
};

export class DDEVConfigBuilder {
  private apiClient: MittwaldAPIV2Client;

  public constructor(apiClient: MittwaldAPIV2Client) {
    this.apiClient = apiClient;
  }

  public async build(
    appInstallationId: string,
    databaseId: string | undefined,
    type: string,
  ): Promise<DDEVConfigBuildResult> {
    const appInstallation = await this.getAppInstallation(appInstallationId);
    const systemSoftwares =
      await this.buildSystemSoftwareVersionMap(appInstallation);

    type = await this.determineProjectType(appInstallation, type);

    const warnings: string[] = [];
    const phpVersion = this.determinePHPVersion(systemSoftwares, warnings);

    return {
      config: {
        type,
        webserver_type: "apache-fpm",
        php_version: phpVersion,
        database: await this.determineDatabaseVersion(databaseId),
        docroot: await this.determineDocumentRoot(appInstallation),
        web_environment: [
          `MITTWALD_APP_INSTALLATION_ID=${appInstallation.shortId}`,
          `MITTWALD_DATABASE_ID=${databaseId ?? ""}`,
        ],
        hooks: this.buildHooks(type),
      },
      warnings,
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

    const autoDetermined = await determineProjectTypeFromAppInstallation(
      this.apiClient,
      inst,
    );
    if (autoDetermined) {
      return autoDetermined;
    }

    throw new Error(
      "Automatic project type detection failed. Please specify the project type manually by setting the `--override-type` flag.",
    );
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

  private determinePHPVersion(
    systemSoftwareVersions: SystemSoftwareVersions,
    warnings: string[],
  ): string | undefined {
    if (!("php" in systemSoftwareVersions)) {
      return undefined;
    }

    const originalVersion = systemSoftwareVersions["php"];
    const normalizedVersion = stripPatchLevelVersion(originalVersion);

    if (hasExtendedSupportSuffix(originalVersion)) {
      warnings.push(
        `The PHP version used by this project (${originalVersion}) is an extended support version ` +
          `that is not directly supported by DDEV. ` +
          `Falling back to PHP ${normalizedVersion}. ` +
          `This may cause unintended side effects.`,
      );
    }

    return normalizedVersion;
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

const extendedSupportSuffixPattern = /-[a-z]+$/i;

export function hasExtendedSupportSuffix(version: string): boolean {
  return extendedSupportSuffixPattern.test(version);
}

export function stripPatchLevelVersion(version: string): string {
  const [major, minor] = version.split(".");
  // Strip any extended support suffix (e.g. "-es") from the minor version
  const cleanMinor = minor ? minor.replace(extendedSupportSuffixPattern, "") : minor;
  return `${major}.${cleanMinor}`;
}
