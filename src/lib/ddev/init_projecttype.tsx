import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { MittwaldAPIV2Client, assertStatus } from "@mittwald/api-client";
import { typo3Installer } from "../../commands/app/install/typo3.js";
import { wordpressInstaller } from "../../commands/app/install/wordpress.js";
import { shopware6Installer } from "../../commands/app/install/shopware6.js";
import { drupalInstaller } from "../../commands/app/install/drupal.js";
import { ProcessRenderer } from "../../rendering/process/process.js";
import { Value } from "../../rendering/react/components/Value.js";
import { Text } from "ink";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

/**
 * A list of all known DDEV project types. Shamelessly stolen from
 * https://ddev.readthedocs.io/en/latest/users/configuration/config/#type
 */
export const knownDDEVProjectTypes = [
  "backdrop",
  "craftcms",
  "django4",
  "drupal6",
  "drupal7",
  "drupal",
  "laravel",
  "magento",
  "magento2",
  "php",
  "python",
  "shopware6",
  "silverstripe",
  "typo3",
  "wordpress",
] as const;

export type DDEVProjectType = (typeof knownDDEVProjectTypes)[number];

async function getAppVersion(
  client: MittwaldAPIV2Client,
  appId: string,
  appVersionId: string,
): Promise<AppVersion> {
  const r = await client.app.getAppversion({
    appId,
    appVersionId,
  });

  assertStatus(r, 200);
  return r.data;
}

/**
 * Determines the DDEV project type to use for the given app installation.
 *
 * This is done according to the following rules:
 *
 * 1. If an explicit override was specified (typically using the --override-type
 *    flag), use that.
 * 2. If the app installation is a known app type (e.g. TYPO3, WordPress, etc.),
 *    use the corresponding DDEV project type.
 * 3. Prompt the user to interactively select a DDEV project type.
 */
export async function determineProjectType(
  r: ProcessRenderer,
  client: MittwaldAPIV2Client,
  inst: AppInstallation,
  typeOverride: DDEVProjectType | "auto",
): Promise<DDEVProjectType> {
  if (typeOverride !== "auto") {
    r.addInfo(<ProjectTypeInfoOverride type={typeOverride} />);
    return typeOverride;
  }

  const determinedProjectType = await determineProjectTypeFromAppInstallation(
    client,
    inst,
  );
  if (determinedProjectType !== null) {
    r.addInfo(<ProjectTypeInfoAuto type={determinedProjectType} />);
    return determinedProjectType;
  }

  return await promptProjectTypeFromUser(r);
}

/**
 * Interactively prompts the user to select a DDEV project type.
 *
 * The list of known project types is hardcoded in this module.
 */
async function promptProjectTypeFromUser(
  r: ProcessRenderer,
): Promise<DDEVProjectType> {
  return r.addSelect(
    "select the DDEV project type",
    knownDDEVProjectTypes.map((t) => ({ value: t, label: t })),
  );
}

/**
 * Determines the project type to use for the given app installation.
 *
 * In most cases, this is a simple mapping from known app IDs to DDEV project
 * types. In some cases, we might need to know the specific (major) version of
 * an app to determine the correct project type (for example, DDEV has separate
 * project types for the different Drupal major versions).
 */
export async function determineProjectTypeFromAppInstallation(
  client: MittwaldAPIV2Client,
  inst: AppInstallation,
): Promise<DDEVProjectType | null> {
  switch (inst.appId) {
    case typo3Installer.appId:
      return "typo3";
    case wordpressInstaller.appId:
      return "wordpress";
    case shopware6Installer.appId:
      return "shopware6";
    case drupalInstaller.appId: {
      const version = await getAppVersion(
        client,
        inst.appId,
        inst.appVersion.desired,
      );

      const [major] = version.externalVersion.split(".");
      if (major === "6" || major === "7") {
        return `drupal${major}`;
      }

      return "drupal";
    }
    default:
      return null;
  }
}

function ProjectTypeInfoOverride({ type }: { type: DDEVProjectType }) {
  return (
    <Text>
      using DDEV project type: <Value>{type}</Value> (explicitly specified)
    </Text>
  );
}

function ProjectTypeInfoAuto({ type }: { type: DDEVProjectType }) {
  return (
    <Text>
      using DDEV project type: <Value>{type}</Value> (derived from app
      installation)
    </Text>
  );
}
