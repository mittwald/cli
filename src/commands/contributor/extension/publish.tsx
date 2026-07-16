import React from "react";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  extensionManifestArg,
  parseExtensionManifest,
} from "../../../lib/resources/extension/args_contributor.js";

export default class Publish extends ExecRenderBaseCommand<
  typeof Publish,
  void
> {
  static description = "Publish an extension on the marketplace";

  static flags = {
    ...processFlags,
  };

  static args = {
    "extension-manifest": extensionManifestArg({ required: true }),
  };

  protected async exec(): Promise<void> {
    const p = makeProcessRenderer(this.flags, "Publishing extension");

    const manifest = await parseExtensionManifest(
      this.args["extension-manifest"],
    );
    const { contributorId, id } = manifest;

    await p.runStep("Publishing extension", async () => {
      await this.apiClient.marketplace.extensionSetExtensionPublishedState({
        contributorId,
        extensionId: id,
        data: {
          published: true,
        },
      });
    });

    await p.complete(<Success>Extension published successfully</Success>);
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
