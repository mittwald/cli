import { ExecRenderBaseCommand } from "../../lib/basecommands/ExecRenderBaseCommand.js";
import { orgFlags, withOrgId } from "../../lib/resources/org/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/process/process_flags.js";
import { Flags } from "@oclif/core";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { ReactNode } from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";

import { expireFlags } from "../../lib/flags/expireFlags.js";

type MembershipCustomerRoles =
  MittwaldAPIV2.Components.Schemas.MembershipCustomerRoles;

const inviteFlags = {
  email: Flags.string({
    description: "The email address of the user to invite.",
    required: true,
  }),
  role: Flags.string({
    description: "The role of the user to invite.",
    options: ["owner", "member", "accountant"],
    default: "member",
  }),
  message: Flags.string({
    description: "A message to include in the invitation email.",
  }),
  ...expireFlags("invitation", false),
};

export class Invite extends ExecRenderBaseCommand<
  typeof Invite,
  { inviteId: string }
> {
  static description = "Invite a user to an organization.";
  static flags = { ...orgFlags, ...processFlags, ...inviteFlags };

  protected async exec(): Promise<{ inviteId: string }> {
    const process = makeProcessRenderer(
      this.flags,
      "Inviting user to organization",
    );
    const customerId = await withOrgId(
      this.apiClient,
      Invite,
      this.flags,
      this.args,
      this.config,
    );

    const invite = await process.runStep("Creating invite", async () => {
      const result = await this.apiClient.customer.createCustomerInvite({
        customerId,
        data: {
          mailAddress: this.flags.email,
          role: this.flags.role as MembershipCustomerRoles,
          message: this.flags.message,
          membershipExpiresAt: this.flags.expires?.toJSON(),
        },
      });

      assertStatus(result, 201);
      return result;
    });

    process.complete(
      <Success>
        The user <Value>{this.flags.email}</Value> was successfully invited to
        your organization!
      </Success>,
    );

    return { inviteId: invite.data.id };
  }

  protected render(executionResult: { inviteId: string }): ReactNode {
    if (this.flags.quiet) {
      return executionResult.inviteId;
    }
    return undefined;
  }
}
