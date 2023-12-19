import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../../lib/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { ReactNode } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { Range, SemVer } from "semver";
import { ProcessRenderer } from "../../../rendering/process/process.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { Text } from "ink";
import AppSystemSoftwareUpdatePolicy = MittwaldAPIV2.Components.Schemas.AppSystemSoftwareUpdatePolicy;
import AppSystemSoftwareVersion = MittwaldAPIV2.Components.Schemas.AppSystemSoftwareVersion;
import AppSystemSoftware = MittwaldAPIV2.Components.Schemas.AppSystemSoftware;

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

      const versions = await this.getVersions(process, systemSoftware);
      const version = await process.runStep(
        `determining version for ${software}`,
        async () => {
          const exactMatch = versions.find(
            (v) => v.externalVersion === versionSpec,
          );
          if (exactMatch) {
            return exactMatch;
          }

          const version = versions.find((v) =>
            parsedVersionSpec.test(v.externalVersion),
          );
          if (!version) {
            const available = versions.map((v) => v.externalVersion).join(", ");
            throw new Error(
              `unknown version ${versionSpec} for ${software}; available versions are: ${available}`,
            );
          }

          return version;
        },
      );

      process.addInfo(
        <Text>
          selected <Value>{systemSoftware.name}</Value> version:{" "}
          <Value>{version.externalVersion}</Value>
        </Text>,
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

    process.complete(
      <Success>
        The dependencies of this app were successfully updated!
      </Success>,
    );
  }

  private async getVersions(
    p: ProcessRenderer,
    systemSoftware: AppSystemSoftware,
  ): Promise<AppSystemSoftwareVersion[]> {
    const versions = await p.runStep(
      `fetching versions for ${systemSoftware.name}`,
      async () => {
        const r = await this.apiClient.app.listSystemsoftwareversions({
          systemSoftwareId: systemSoftware.id,
        });
        assertStatus(r, 200);

        return r.data;
      },
    );

    versions.sort((a, b) => {
      return (
        new SemVer(a.externalVersion).compare(new SemVer(b.externalVersion)) *
        -1
      );
    });

    return versions;
  }

  protected render(): ReactNode {
    return undefined;
  }
}
