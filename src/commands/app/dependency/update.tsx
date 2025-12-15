import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../../lib/resources/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { ReactNode } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { Range } from "semver";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { compareVersionsBy } from "../../../lib/resources/app/versions.js";

type AppSystemSoftwareUpdatePolicy =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareUpdatePolicy;
type AppSystemSoftwareVersion =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
type AppSystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;

export default class Update extends ExecRenderBaseCommand<typeof Update, void> {
  static summary = "Update the dependencies of an app";
  static args = { ...appInstallationArgs };
  static examples = [
    {
      description:
        "Update Node.js version to newest available from the 18.x branch",
      command: "<%= config.bin %> <%= command.id %> $APP_ID --set node=~18",
    },
  ];
  static flags = {
    ...processFlags,
    set: Flags.string({
      summary: "set a dependency to a specific version",
      description: `\
        The format is <dependency>=<version>, where <dependency> is the name of the dependency (use the "<%= config.bin %> app dependency list" command to get a list of available dependencies) and <version> is a semver constraint.

        This flag may be specified multiple times to update multiple dependencies.`,
      multiple: true,
      required: true,
    }),
    "update-policy": Flags.string({
      summary: "set the update policy for the configured dependencies",
      default: "patchLevel",
      options: ["none", "inheritedFromApp", "patchLevel", "all"],
    }),
  };

  protected async exec(): Promise<void> {
    const appInstallationId = await this.withAppInstallationId(Update);
    const updatePolicy = this.flags[
      "update-policy"
    ] as AppSystemSoftwareUpdatePolicy;
    const process = makeProcessRenderer(
      this.flags,
      "Updating app dependencies",
    );
    const systemSoftwares = await process.runStep(
      "fetching system softwares",
      async () => {
        const r = await this.apiClient.app.listSystemsoftwares();
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

    for (const s of this.flags.set) {
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

      const versions = await this.getVersions(
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
      const r = await this.apiClient.app.patchAppinstallation({
        appInstallationId,
        data: {
          systemSoftware: versionsToUpdate,
        },
      });

      assertStatus(r, 204);
    });

    await process.complete(
      <Success>
        The dependencies of this app were successfully updated!
      </Success>,
    );
  }

  private async getVersions(
    p: ProcessRenderer,
    systemSoftware: AppSystemSoftware,
    versionRange: string,
  ): Promise<AppSystemSoftwareVersion[]> {
    const versions = await p.runStep(
      `fetching versions for ${systemSoftware.name}`,
      async () => {
        const r = await this.apiClient.app.listSystemsoftwareversions({
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

  protected render(): ReactNode {
    return undefined;
  }
}
