import React, { FC } from "react";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags, ux } from "@oclif/core";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  extensionManifestArg,
  parseExtensionManifest,
} from "../../../lib/resources/extension/args_contributor.js";
import { Text } from "ink";
import { Value } from "../../../rendering/react/components/Value.js";
import { ExtensionManifest } from "../../../lib/resources/extension/manifest.js";
import { ProcessRenderer } from "../../../rendering/process/process.js";

export default class Withdraw extends ExecRenderBaseCommand<
  typeof Withdraw,
  void
> {
  static description = "Withdraw an extension from the marketplace";

  static flags = {
    ...processFlags,
    force: Flags.boolean({
      char: "f",
      description: "do not ask for confirmation",
    }),
    reason: Flags.string({
      description: "reason for withdrawal",
      required: true,
    }),
  };

  static args = {
    "extension-manifest": extensionManifestArg({ required: true }),
  };

  protected async exec(): Promise<void> {
    const p = makeProcessRenderer(this.flags, "Withdrawing extension");

    const { reason } = this.flags;
    const manifest = await parseExtensionManifest(
      this.args["extension-manifest"],
    );
    const { contributorId, id } = manifest;

    if (!(await this.shouldProceed(p, manifest))) {
      ux.exit(1);
    }

    await p.runStep("Withdrawing extension", async () => {
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

  protected async shouldProceed(
    p: ProcessRenderer,
    manifest: ExtensionManifest,
  ): Promise<boolean> {
    if (this.flags.force) {
      return true;
    }

    const confirmed = await p.addConfirmation(
      <TextConfirmWithdrawal manifest={manifest} />,
    );
    if (confirmed) {
      return true;
    }

    p.addInfo(<TextWithdrawalCancelled manifest={manifest} />);
    p.complete(<></>);

    return false;
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}

const TextConfirmWithdrawal: FC<{ manifest: ExtensionManifest }> = ({
  manifest,
}) => (
  <Text>
    confirm withdrawal of extension <Value>{manifest.name}</Value>
  </Text>
);

const TextWithdrawalCancelled: FC<{ manifest: ExtensionManifest }> = ({
  manifest,
}) => (
  <Text>
    withdrawal of extension <Value>{manifest.name}</Value> was cancelled
  </Text>
);
