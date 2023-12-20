import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { projectFlags } from "../../../lib/project/flags.js";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { waitUntil } from "../../../lib/wait.js";
import { Box } from "ink";
import { DnsValidationErrors } from "../../../rendering/react/components/Ingress/DnsValidationErrors.js";
import { DomainOwnership } from "../../../rendering/react/components/Ingress/DomainOwnership.js";
import IngressPath = MittwaldAPIV2.Components.Schemas.IngressPath;
import IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;
import DomainDomainOwnership = MittwaldAPIV2.Components.Schemas.DomainDomainOwnership;

type VerifyResult = void;

export default class Verify extends ExecRenderBaseCommand<
  typeof Verify,
  VerifyResult
> {
  static description = "Verify domain ownership";
  static flags = {
    ...processFlags,
    ...projectFlags,
  };
  static args = {
    hostname: Args.string({
      description: "Name of the domain to verify",
      required: true,
    }),
  };

  protected async exec(): Promise<VerifyResult> {
    const { hostname } = this.args;
    const projectId = await this.withProjectId(Verify);
    const process = makeProcessRenderer(
      this.flags,
      "Verifying domain ownership",
    );

    const ownerships = await process.runStep(
      "getting pending domain ownerships",
      async () => {
        const response = await this.apiClient.domain.listDomainOwnerships({
          projectId,
        });
        assertStatus(response, 200);

        return response.data;
      },
    );

    const ownership = ownerships.find((o) => o.domain === hostname);
    if (!ownership) {
      throw new Error(`No pending domain ownership for ${hostname} found.`);
    }

    await process.runStep("verifying domain ownership", async () => {
      const response = await this.apiClient.domain.verifyDomainOwnership({
        domainOwnershipId: ownership.id,
      });
      assertStatus(response, 204);
    });

    process.complete(
      <Success>Domain ownership was successfully verified.</Success>,
    );

    return;
  }

  protected render(): ReactNode {
    return <></>;
  }
}
