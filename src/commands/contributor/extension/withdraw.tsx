import React from "react";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  extensionManifestArg,
  parseExtensionManifest,
} from "../../../lib/resources/extension/args_contributor.js";

type PublishResult = void;

export default class Withdraw extends ExecRenderBaseCommand<
  typeof Withdraw,
  PublishResult
> {
  static description = "Withdraw an extension from the marketplace";

  static flags = {
    ...processFlags,
    reason: Flags.string({
      description: "Reason for withdrawal",
      required: true,
    }),
  };

  static args = {
    "extension-manifest": extensionManifestArg({ required: true }),
  };

  protected async exec(): Promise<PublishResult> {
    const p = makeProcessRenderer(this.flags, "Publishing extension");

    const { reason } = this.flags;
    const manifest = await parseExtensionManifest(
      this.args["extension-manifest"],
    );
    const { contributorId, id } = manifest;

    await p.runStep("Publishing extension", async () => {
      await this.apiClient.marketplace.extensionSetExtensionPublishedState({
        contributorId,
        extensionId: id,
        data: {
          published: false,
          reason,
        },
      });
    });

    await p.complete(<Success>Extension withdrawn successfully</Success>);
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
