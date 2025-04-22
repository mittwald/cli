import React from "react";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  extensionManifestArg,
  parseExtensionManifest,
} from "../../../lib/resources/extension/args_contributor.js";

export default class Deploy extends ExecRenderBaseCommand<typeof Deploy, void> {
  static description = "Deploy an extension manifest to the marketplace";

  static flags = {
    ...processFlags,
    create: Flags.boolean({
      description: "create the extension if it does not exist",
      default: true,
      allowNo: true,
    }),
  };

  static args = {
    "extension-manifest": extensionManifestArg({
      required: true,
    }),
  };

  protected async exec(): Promise<void> {
    const p = makeProcessRenderer(this.flags, "Updating extension manifest");

    const manifest = await parseExtensionManifest(
      this.args["extension-manifest"],
    );
    const { contributorId, id } = manifest;

    const existing = await p.runStep(
      "Retrieving current extension state",
      async () => {
        const response =
          await this.apiClient.marketplace.extensionGetOwnExtension({
            contributorId,
            extensionId: id,
          });

        if (response.status === 404) {
          return null;
        }

        assertStatus(response, 200);

        return response.data;
      },
    );

    if (existing === null) {
      if (!this.flags.create) {
        await p.error("Extension does not exist, use --create to create it");
        return;
      }

      await p.runStep("Registering extension", async () => {
        if (manifest.deprecation) {
          throw new Error(
            '"deprecation" is not supported when creating a new extension',
          );
        }

        await this.apiClient.marketplace.extensionRegisterExtension({
          contributorId,
          data: {
            description: manifest.description,
            detailedDescriptions: manifest.detailedDescriptions,
            externalFrontends: manifest.externalFrontends,
            frontendFragments: manifest.frontendFragments,
            name: manifest.name,
            scopes: manifest.scopes,
            subTitle: manifest.subTitle,
            support: manifest.support,
            tags: manifest.tags,
            webhookURLs: manifest.webhookUrls,
          },
        });
      });
    } else {
      await p.runStep("Updating extension", async () => {
        await this.apiClient.marketplace.extensionPatchExtension({
          extensionId: manifest.id,
          contributorId: manifest.contributorId,
          data: {
            deprecation: manifest.deprecation,
            description: manifest.description,
            detailedDescriptions: manifest.detailedDescriptions,
            externalFrontends: manifest.externalFrontends,
            frontendFragments: manifest.frontendFragments,
            name: manifest.name,
            scopes: manifest.scopes,
            subTitle: manifest.subTitle,
            support: manifest.support,
            tags: manifest.tags,
            webhookUrls: manifest.webhookUrls,
          },
        });
      });
    }

    await p.complete(<Success>Extension deployed successfully</Success>);
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
