import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import React from "react";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/resources/app/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../rendering/react/components/Success.js";
import { Flags } from "@oclif/core";
import { CommandFlags } from "../../lib/basecommands/CommandFlags.js";

type AppSavedUserInput = MittwaldAPIV2.Components.Schemas.AppSavedUserInput;
type AppAppUpdatePolicy = MittwaldAPIV2.Components.Schemas.AppAppUpdatePolicy;

/**
 * This is a carefully selected subset of the "patchAppinstallation" request
 * body; the type needs to be inlined, because it's not exported from the API
 * client.
 */
type UpdateBody = {
  customDocumentRoot?: string;
  description?: string;
  updatePolicy?: AppAppUpdatePolicy;
  userInputs?: AppSavedUserInput[];
};

export class Update extends ExecRenderBaseCommand<typeof Update, void> {
  static summary =
    "Update properties of an app installation (use 'upgrade' to update the app version)";
  static args = { ...appInstallationArgs };
  static flags = {
    ...processFlags,
    description: Flags.string({
      summary: "update the description of the app installation",
      description:
        "This flag updates the description of the app installation. If omitted, the description will not be changed.",
      default: undefined,
      required: false,
    }),
    entrypoint: Flags.string({
      summary:
        "update the entrypoint of the app installation (Python and Node.js only)",
      description:
        "Updates the entrypoint of the app installation. If omitted, the entrypoint will not be changed. Note that this field is only available for some types of apps (like Python and Node.js).",
      required: false,
      default: undefined,
    }),
    "document-root": Flags.string({
      summary: "update the document root of the app installation",
      description:
        "Updates the document root of the app installation. If omitted, the document root will not be changed. Note that not all apps support this field.",
      required: false,
      default: undefined,
    }),
  };

  protected async exec(): Promise<void> {
    const p = makeProcessRenderer(this.flags, "Updating app installation");
    const appInstallationId = await withAppInstallationId(
      this.apiClient,
      Update,
      this.flags,
      this.args,
      this.config,
    );

    const [updateBody, info] = buildUpdateBodyFromFlags(this.flags);

    info.forEach((i) => p.addInfo(i));

    if (Object.keys(updateBody).length === 0) {
      p.addInfo("skipping update");
      await p.complete(<Success>No changes to apply</Success>);
      return;
    }

    this.debug("updating app installation: %O", updateBody);

    await p.runStep("updating app", async () => {
      await this.apiClient.app.patchAppinstallation({
        appInstallationId,
        data: updateBody,
      });
    });

    await p.complete(<Success>App installation successfully updated</Success>);
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}

function buildUpdateBodyFromFlags(
  flags: CommandFlags<typeof Update>,
): [UpdateBody, string[]] {
  const updateBody: UpdateBody = {};
  const info: string[] = [];

  if (flags.entrypoint) {
    info.push(`setting entrypoint to ${flags.entrypoint}`);
    updateBody.userInputs = [
      ...(updateBody.userInputs || []),
      {
        name: "entrypoint",
        value: flags.entrypoint,
      },
    ];
  }

  if (flags["document-root"]) {
    info.push(`setting document root to ${flags["document-root"]}`);
    updateBody.customDocumentRoot = flags["document-root"];
  }

  if (flags.description !== undefined) {
    info.push(`setting description to ${flags.description}`);
    updateBody.description = flags.description;
  }

  return [updateBody, info];
}
