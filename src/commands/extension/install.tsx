import React from "react";
import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Args, Flags } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client";
import Context, { contextIDNormalizers } from "../../lib/context/Context.js";

type InstallResult = {
  extensionInstanceId: string;
};

export default class Install extends ExecRenderBaseCommand<
  typeof Install,
  InstallResult
> {
  static description = "Install an extension in a project or organization";

  static flags = {
    ...processFlags,
    "org-id": Flags.string({
      description: "the ID of the organization to install the extension in",
      exactlyOne: ["org-id", "project-id"],
    }),
    "project-id": Flags.string({
      description: "the ID of the project to install the extension in",
      exactlyOne: ["org-id", "project-id"],
    }),
    consent: Flags.boolean({
      description:
        "consent to the extension having access to the requested scopes",
    }),
  };

  static args = {
    "extension-id": Args.string({
      description: "the ID of the extension to install",
      required: true,
    }),
  };

  protected async exec(): Promise<InstallResult> {
    const { "extension-id": extensionId } = this.args;
    const { consent } = this.flags;
    let { "org-id": orgId, "project-id": projectId } = this.flags;

    const p = makeProcessRenderer(this.flags, "Installing extension");

    const ext = await p.runStep("Loading extension", async () => {
      const response = await this.apiClient.marketplace.extensionGetExtension({
        extensionId,
      });

      assertStatus(response, 200);

      return response.data;
    });

    const ctx = new Context(this.apiClient, this.config);

    if (orgId !== undefined) {
      const normalizer = contextIDNormalizers["org-id"]!;
      orgId = await normalizer(this.apiClient, orgId, ctx);
    }

    if (projectId !== undefined) {
      const normalizer = contextIDNormalizers["project-id"]!;
      projectId = await normalizer(this.apiClient, projectId, ctx);
    }

    if (!consent) {
      p.addInfo(
        `This extension requires access to the following scopes: ${ext.scopes.join(", ")}. Please confirm your consent, or run the command with the --consent flag.`,
      );
      const consentedInteractively = await p.addConfirmation(
        "Consent to requested scopes?",
      );

      if (!consentedInteractively) {
        throw new Error(
          "Consent was not given; skipping extension installation",
        );
      }
    }

    const result = await p.runStep("installing extension", async () => {
      const resp =
        await this.apiClient.marketplace.extensionCreateExtensionInstance({
          data: {
            extensionId,
            context: orgId ? "customer" : "project",
            contextId: (orgId ?? projectId)!,
            consentedScopes: ext.scopes,
          },
        });

      assertStatus(resp, 201);
      return resp;
    });

    return {
      extensionInstanceId: result.data.id,
    };
  }

  protected render(executionResult: InstallResult): React.ReactNode {
    if (this.flags.quiet) {
      return executionResult.extensionInstanceId;
    }

    return undefined;
  }
}
