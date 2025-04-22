import React from "react";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import { Success } from "../../../rendering/react/components/Success.js";
import { extensionManifestArg } from "../../../lib/resources/extension/args_contributor.js";
import { ExtensionManifest } from "../../../lib/resources/extension/manifest.js";
import * as uuid from "uuid";
import { writeFile } from "fs/promises";
import yaml from "js-yaml";
import { Value } from "../../../rendering/react/components/Value.js";

type UpdateResult = void;

export default class Init extends ExecRenderBaseCommand<
  typeof Init,
  UpdateResult
> {
  static summary = "Init a new extension manifest file";
  static description =
    "This command will create a new extension manifest file. It only operates on your local file system; afterwards, use the 'deploy' command to upload the manifest to the marketplace.";

  static flags = {
    ...processFlags,
    overwrite: Flags.boolean({
      description: "overwrite an existing extension manifest if found",
      default: false,
    }),
  };

  static args = {
    "extension-manifest": extensionManifestArg({
      required: true,
    }),
  };

  protected async exec(): Promise<UpdateResult> {
    const p = makeProcessRenderer(
      this.flags,
      "Initializing extension manifest",
    );

    await p.runStep("generating extension manifest file", async () => {
      const renderedConfiguration: ExtensionManifest = {
        name: "my-extension",
        contributorId: "TODO",
        id: uuid.v4(),
        description: "TODO",
        detailedDescriptions: {
          de: {
            markdown: "TODO",
            plain: "TODO",
          },
          en: {
            markdown: "TODO",
            plain: "TODO",
          },
        },
        externalFrontends: [
          {
            name: "example",
            url: "https://mstudio-extension.example/auth/oneclick?atrek=:accessTokenRetrievalKey&userId=:userId&instanceID=:extensionInstanceId",
          },
        ],
        frontendFragments: {
          foo: {
            url: "https://mstudio-extension.example/",
          },
        },
        scopes: ["user:read"],
        subTitle: {
          de: "TODO",
          en: "TODO",
        },
        support: {
          email: "todo@mstudio-extension.example",
          phone: "+49 0000 000000",
        },
        tags: ["TODO"],
        webhookUrls: {
          extensionAddedToContext: {
            url: "https://mstudio-extension.example/webhooks",
          },
          extensionInstanceUpdated: {
            url: "https://mstudio-extension.example/webhooks",
          },
          extensionInstanceSecretRotated: {
            url: "https://mstudio-extension.example/webhooks",
          },
          extensionInstanceRemovedFromContext: {
            url: "https://mstudio-extension.example/webhooks",
          },
        },
      };

      await writeFile(
        this.args["extension-manifest"],
        yaml.dump(renderedConfiguration),
      );
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
