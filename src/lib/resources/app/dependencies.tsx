import { assertStatus } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { validRange } from "semver";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { compareVersionsBy } from "./versions.js";

type AppSystemSoftwareUpdatePolicy =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareUpdatePolicy;
type AppSystemSoftwareVersion =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
type AppSystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;

type SystemSoftwareUpdate = {
  systemSoftwareVersion: string;
  updatePolicy: AppSystemSoftwareUpdatePolicy;
};

/** A map of system-software id to the version it should be pinned to. */
export type SystemSoftwareUpdateMap = Record<string, SystemSoftwareUpdate>;

/**
 * Resolves a list of `<dependency>=<version>` specifications into a map of
 * system-software id to the concrete version it should be pinned to.
 *
 * `<dependency>` is the name of a system software (e.g. `php`) and `<version>`
 * is a semver constraint (e.g. `~8.3`). For each spec, the matching available
 * version is resolved.
 */
export async function resolveSystemSoftwareUpdates(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  set: string[],
  updatePolicy: AppSystemSoftwareUpdatePolicy,
): Promise<SystemSoftwareUpdateMap> {
  const systemSoftwares = await listSystemSoftwares(apiClient, process);

  const updates: SystemSoftwareUpdateMap = {};
  for (const spec of set) {
    const { name, versionSpec } = parseDependencySpec(spec);
    const systemSoftware = findSystemSoftware(systemSoftwares, name);
    const version = await resolveSystemSoftwareVersion(
      apiClient,
      process,
      systemSoftware,
      versionSpec,
    );

    updates[systemSoftware.id] = {
      systemSoftwareVersion: version.id,
      updatePolicy,
    };
  }

  return updates;
}

/**
 * Updates the system-software dependencies of an existing app installation by
 * resolving the given specifications and patching the installation
 * accordingly.
 */
export async function updateAppDependencies(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  appInstallationId: string,
  set: string[],
  updatePolicy: AppSystemSoftwareUpdatePolicy,
): Promise<void> {
  const updates = await resolveSystemSoftwareUpdates(
    apiClient,
    process,
    set,
    updatePolicy,
  );

  await patchSystemSoftwareVersions(
    apiClient,
    process,
    appInstallationId,
    updates,
  );
}

/** Splits a `<dependency>=<version>` spec and validates the version range. */
function parseDependencySpec(spec: string): {
  name: string;
  versionSpec: string;
} {
  const [name, versionSpec] = spec.split("=");

  if (!validRange(versionSpec)) {
    throw new Error(
      `version spec ${versionSpec} is not a valid semver constraint`,
    );
  }

  return { name, versionSpec };
}

/** Looks up a system software by name (case-insensitive). */
function findSystemSoftware(
  systemSoftwares: AppSystemSoftware[],
  name: string,
): AppSystemSoftware {
  const systemSoftware = systemSoftwares.find(
    (s) => s.name.toLowerCase() === name.toLowerCase(),
  );
  if (!systemSoftware) {
    throw new Error(`unknown system software ${name}`);
  }

  return systemSoftware;
}

/** Picks the best available version for the given constraint. */
function selectVersion(
  versions: AppSystemSoftwareVersion[],
  versionSpec: string,
  softwareName: string,
): AppSystemSoftwareVersion {
  if (versions.length === 0) {
    throw new Error(
      `no versions found for ${softwareName} and version constraint ${versionSpec}`,
    );
  }

  return (
    versions.find((v) => v.externalVersion === versionSpec) ??
    versions.find((v) => v.recommended) ??
    versions[versions.length - 1]
  );
}

async function listSystemSoftwares(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
): Promise<AppSystemSoftware[]> {
  return process.runStep("fetching system softwares", async () => {
    const r = await apiClient.app.listSystemsoftwares();
    assertStatus(r, 200);

    return r.data;
  });
}

async function resolveSystemSoftwareVersion(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  systemSoftware: AppSystemSoftware,
  versionSpec: string,
): Promise<AppSystemSoftwareVersion> {
  const versions = await listSystemSoftwareVersions(
    apiClient,
    process,
    systemSoftware,
    versionSpec,
  );

  const version = await process.runStep(
    `determining version for ${systemSoftware.name}`,
    async () => selectVersion(versions, versionSpec, systemSoftware.name),
  );

  process.addInfo(
    `selected ${systemSoftware.name} version: ${version.externalVersion}`,
  );

  return version;
}

async function listSystemSoftwareVersions(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  systemSoftware: AppSystemSoftware,
  versionRange: string,
): Promise<AppSystemSoftwareVersion[]> {
  const versions = await process.runStep(
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

async function patchSystemSoftwareVersions(
  apiClient: MittwaldAPIV2Client,
  process: ProcessRenderer,
  appInstallationId: string,
  updates: SystemSoftwareUpdateMap,
): Promise<void> {
  await process.runStep("updating app dependencies", async () => {
    const r = await apiClient.app.patchAppinstallation({
      appInstallationId,
      data: {
        systemSoftware: updates,
      },
    });

    assertStatus(r, 204);
  });
}
