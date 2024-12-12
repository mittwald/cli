import React from "react";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Args } from "@oclif/core";
import assertSuccess from "../../lib/apiutil/assert_success.js";
import { Success } from "../../rendering/react/components/Success.js";

export default class Uninstall extends ExecRenderBaseCommand<
  typeof Uninstall,
  void
> {
  static description = "Remove an extension from an organization";

  static flags = {
    ...processFlags,
  };

  static args = {
    "extension-instance-id": Args.string({
      description: "the ID of the extension instance to uninstall",
      required: true,
    }),
  };

  protected async exec(): Promise<void> {
    const { "extension-instance-id": extensionInstanceId } = this.args;

    const p = makeProcessRenderer(this.flags, "Uninstalling extension");

    await p.runStep("removing extension instance", async () => {
      const resp =
        await this.apiClient.marketplace.extensionDeleteExtensionInstance({
          extensionInstanceId,
        });

      assertSuccess(resp);
    });

    await p.complete(<Success>Extension successfully uninstalled</Success>);
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
