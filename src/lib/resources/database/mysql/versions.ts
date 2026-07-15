import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { assertStatus } from "@mittwald/api-client-commons";
import semver from "semver";

type MySqlVersion = MittwaldAPIV2.Components.Schemas.DatabaseMySqlVersion;

/**
 * MySQL versions are given in `<major>.<minor>` format, which is not valid
 * semantic versioning; `semver.coerce` pads them to `<major>.<minor>.0`.
 */
function toSemver(version: string): semver.SemVer {
  const coerced = semver.coerce(version);
  if (!coerced) {
    throw new Error(`could not parse MySQL version "${version}"`);
  }
  return coerced;
}

export function compareVersions(a: MySqlVersion, b: MySqlVersion): number {
  return semver.compare(toSemver(a.number), toSemver(b.number));
}

/**
 * Determines the versions a database running `currentVersion` may be upgraded
 * to. MySQL does not support downgrades, so only newer versions are considered;
 * versions that are disabled are not offered for new upgrades.
 */
export function getUpgradeCandidates(
  versions: MySqlVersion[],
  currentVersion: string,
): MySqlVersion[] {
  const current = toSemver(currentVersion);

  return versions
    .filter((v) => !v.disabled && semver.gt(toSemver(v.number), current))
    .sort(compareVersions);
}

export async function getUpgradeCandidatesForVersion(
  apiClient: MittwaldAPIV2Client,
  currentVersion: string,
): Promise<MySqlVersion[]> {
  const response = await apiClient.database.listMysqlVersions({});
  assertStatus(response, 200);

  return getUpgradeCandidates(response.data, currentVersion);
}
