import { assertStatus } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Range } from "semver";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { compareVersionsBy } from "./versions.js";

type AppSystemSoftwareUpdatePolicy =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareUpdatePolicy;
type AppSystemSoftwareVersion =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
type AppSystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;

/**
 * Updates the system-software dependencies of an app installation.
 *
 * Each entry in `set` is a `<dependency>=<version>` specification, where
 * `<dependency>` is the name of a system software (e.g. `php`) and `<version>`
 * is a semver constraint (e.g. `~8.3`). For each spec, the matching available
 * version is resolved and the installation is patched accordingly.
 */
export async function updateAppDependencies(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  appInstallationId: string,
  set: string[],
  updatePolicy: AppSystemSoftwareUpdatePolicy,
): Promise<void> {
  const systemSoftwares = await process.runStep(
    "fetching system softwares",
    async () => {
      const r = await apiClient.app.listSystemsoftwares();
      assertStatus(r, 200);

      return r.data;
    },
  );

  const versionsToUpdate: {
    [x: string]: {
      systemSoftwareVersion: string;
      updatePolicy: AppSystemSoftwareUpdatePolicy;
    };
  } = {};

  for (const s of set) {
    const [software, versionSpec] = s.split("=");
    const parsedVersionSpec = new Range(versionSpec);

    if (!parsedVersionSpec) {
      throw new Error(
        `version spec ${versionSpec} is not a valid semver constraint`,
      );
    }

    const systemSoftware = systemSoftwares.find(
      (s) => s.name.toLowerCase() === software.toLowerCase(),
    );
    if (!systemSoftware) {
      throw new Error(`unknown system software ${software}`);
    }

    const versions = await getVersions(
      apiClient,
      process,
      systemSoftware,
      versionSpec,
    );
    const version = await process.runStep(
      `determining version for ${software}`,
      async () => {
        const exactMatch = versions.find(
          (v) => v.externalVersion === versionSpec,
        );
        if (exactMatch) {
          return exactMatch;
        }

        const recommendedVersion = versions.find((v) => v.recommended);
        if (recommendedVersion) {
          return recommendedVersion;
        }

        if (versions.length === 0) {
          throw new Error(
            `no versions found for ${software} and version constraint ${versionSpec}`,
          );
        }

        return versions[versions.length - 1];
      },
    );

    process.addInfo(
      `selected ${systemSoftware.name} version: ${version.externalVersion}`,
    );

    versionsToUpdate[systemSoftware.id] = {
      systemSoftwareVersion: version.id,
      updatePolicy,
    };
  }

  await process.runStep("updating app dependencies", async () => {
    const r = await apiClient.app.patchAppinstallation({
      appInstallationId,
      data: {
        systemSoftware: versionsToUpdate,
      },
    });

    assertStatus(r, 204);
  });
}

async function getVersions(
  apiClient: MittwaldAPIV2Client,
  p: ProcessRenderer,
  systemSoftware: AppSystemSoftware,
  versionRange: string,
): Promise<AppSystemSoftwareVersion[]> {
  const versions = await p.runStep(
    `fetching versions for ${systemSoftware.name}`,
    async () => {
      const r = await apiClient.app.listSystemsoftwareversions({
        systemSoftwareId: systemSoftware.id,
        queryParameters: {
          versionRange,
        },
      });
      assertStatus(r, 200);

      return r.data;
    },
  );

  versions.sort(compareVersionsBy("internal"));
  return versions;
}
