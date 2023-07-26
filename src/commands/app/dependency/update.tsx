import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import { appInstallationFlags } from "../../../lib/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { ReactNode } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import AppSystemSoftwareUpdatePolicy = MittwaldAPIV2.Components.Schemas.AppSystemSoftwareUpdatePolicy;
import { Success } from "../../../rendering/react/components/Success.js";

export default class Update extends ExecRenderBaseCommand<typeof Update, void> {
  static summary = "Update the dependencies of an app";
  static args = { ...appInstallationFlags };
  static flags = {
    ...processFlags,
    set: Flags.string({
      summary: "set a dependency to a specific version",
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
    const appInstallationId = this.args["installation-id"];
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

    const appInstallation = await process.runStep(
      "fetching app installation",
      async () => {
        const r = await this.apiClient.app.getAppinstallation({
          pathParameters: { appInstallationId },
        });
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
      const systemSoftware = systemSoftwares.find(
        (s) => s.name.toLowerCase() === software.toLowerCase(),
      );
      if (!systemSoftware) {
        throw new Error(`unknown system software ${software}`);
      }

      const versions = await process.runStep(
        `fetching versions for ${software}`,
        async () => {
          const r = await this.apiClient.app.listSystemsoftwareversions({
            pathParameters: { systemSoftwareId: systemSoftware.id },
          });
          assertStatus(r, 200);

          return r.data;
        },
      );

      const version = await process.runStep(
        `determining version for ${software}`,
        async () => {
          const version = versions.find(
            (v) => v.externalVersion === versionSpec,
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

      versionsToUpdate[systemSoftware.id] = {
        systemSoftwareVersion: version.id,
        updatePolicy,
      };
    }

    await process.runStep("updating app dependencies", async () => {
      const r = await this.apiClient.app.patchAppinstallation({
        pathParameters: { appInstallationId },
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

  protected render(): ReactNode {
    return undefined;
  }
}
