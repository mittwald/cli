import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import { appInstallationArgs } from "../../../lib/resources/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { ReactNode } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { updateAppDependencies } from "../../../lib/resources/app/dependencies.js";

type AppSystemSoftwareUpdatePolicy =
  MittwaldAPIV2.Components.Schemas.AppSystemSoftwareUpdatePolicy;

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

    await updateAppDependencies(
      this.apiClient,
      process,
      appInstallationId,
      this.flags.set,
      updatePolicy,
    );

    await process.complete(
      <Success>
        The dependencies of this app were successfully updated!
      </Success>,
    );
  }

  protected render(): ReactNode {
    return undefined;
  }
}
