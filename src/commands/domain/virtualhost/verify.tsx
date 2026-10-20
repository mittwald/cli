import { ReactNode } from "react";
import { Args } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Text } from "ink";
import { ExecRenderBaseCommand } from "../../../lib/basecommands/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { getVirtualHost } from "../../../lib/resources/domain/virtualhost/ingress.js";
import {
  needsOwnershipVerification,
  verifyOwnership,
} from "../../../lib/resources/domain/virtualhost/ownership.js";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { OwnershipVerification } from "../../../rendering/react/components/Ingress/OwnershipVerification.js";

type IngressIngress = MittwaldAPIV2.Components.Schemas.IngressIngress;

type Result = {
  ingress: IngressIngress;
};

export default class Verify extends ExecRenderBaseCommand<
  typeof Verify,
  Result
> {
  static summary = "Verify the ownership of a virtual host's domain";
  static description =
    "Asks mStudio to check the TXT record that proves the ownership of the virtual host's domain. The virtual host gets its IP addresses once its domain is verified.";
  static examples = [
    {
      description: "Verify a virtual host's domain once its TXT record is set",
      command: "<%= config.bin %> <%= command.id %> <virtual-host-id>",
    },
  ];
  static flags = {
    ...processFlags,
  };
  static args = {
    "virtual-host-id": Args.string({
      description: "ID of the virtual host to verify",
      required: true,
    }),
  };

  private unverified = false;

  public async run(): Promise<void> {
    await super.run();

    // Exit only after render(), which names the TXT record that is missing.
    if (this.unverified) {
      this.exit(1);
    }
  }

  protected async exec(): Promise<Result> {
    const p = makeProcessRenderer(this.flags, "Verifying domain ownership");
    const ingressId = this.args["virtual-host-id"];

    const ingress = await p.runStep("fetching virtual host", () =>
      getVirtualHost(this.apiClient, ingressId),
    );

    if (!needsOwnershipVerification(ingress)) {
      await p.complete(
        <Success>
          The virtual host <Value>{ingress.hostname}</Value> needs no
          verification.
        </Success>,
      );
      return { ingress };
    }

    const verified = await p.runStep("checking TXT record", () =>
      verifyOwnership(this.apiClient, ingressId),
    );

    if (!verified) {
      await p.complete(
        <Text>
          The domain of <Value>{ingress.hostname}</Value> is not verified.
        </Text>,
      );
      this.unverified = true;
      return { ingress };
    }

    const verifiedIngress = await p.runStep("fetching virtual host", () =>
      getVirtualHost(this.apiClient, ingressId),
    );

    await p.complete(
      <Success>
        The domain of <Value>{verifiedIngress.hostname}</Value> is verified.
      </Success>,
    );
    return { ingress: verifiedIngress };
  }

  protected render({ ingress }: Result): ReactNode {
    if (this.flags.quiet) {
      return ingress.id;
    }

    if (needsOwnershipVerification(ingress)) {
      return <OwnershipVerification ingress={ingress} />;
    }
  }
}
