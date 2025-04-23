import React from "react";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { Success } from "../../../rendering/react/components/Success.js";
import { extensionManifestArg } from "../../../lib/resources/extension/args_contributor.js";
import { writeFile } from "fs/promises";
import { Value } from "../../../rendering/react/components/Value.js";
import { pathExists } from "../../../lib/util/fs/pathExists.js";
import { generateInitialExtensionManifest } from "../../../lib/resources/extension/init.js";

const overwriteFlagName = "overwrite";

export default class Init extends ExecRenderBaseCommand<typeof Init, void> {
  static summary = "Init a new extension manifest file";
  static description =
    "This command will create a new extension manifest file. It only operates on your local file system; afterwards, use the 'deploy' command to upload the manifest to the marketplace.";

  static flags = {
    ...processFlags,
    [overwriteFlagName]: Flags.boolean({
      description: "overwrite an existing extension manifest if found",
      default: false,
    }),
  };

  static args = {
    "extension-manifest": extensionManifestArg({
      required: true,
    }),
  };

  protected async exec(): Promise<void> {
    const p = makeProcessRenderer(
      this.flags,
      "Initializing extension manifest",
    );

    const { overwrite } = this.flags;

    await p.runStep("generating extension manifest file", async () => {
      const renderedConfiguration = generateInitialExtensionManifest();
      const manifestAlreadyExists = await pathExists(
        this.args["extension-manifest"],
      );

      if (manifestAlreadyExists && !overwrite) {
        throw new Error(
          `File already exists. Use --${overwriteFlagName} to overwrite it.`,
        );
      }

      await writeFile(this.args["extension-manifest"], renderedConfiguration);
    });

    await p.complete(
      <Success>
        Extension manifest file created at{" "}
        <Value>{this.args["extension-manifest"]}</Value>
      </Success>,
    );
  }

  protected render(): React.ReactNode {
    return undefined;
  }
}
