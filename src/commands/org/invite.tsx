import { ExecRenderBaseCommand } from "../../rendering/react/ExecRenderBaseCommand.js";
import { orgFlags, withOrgId } from "../../lib/org/flags.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../rendering/react/process_flags.js";
import { Flags } from "@oclif/core";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import MembershipCustomerRoles = MittwaldAPIV2.Components.Schemas.MembershipCustomerRoles;
import { ReactNode } from "react";
import parseDuration from "parse-duration";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../rendering/react/components/Success.js";
import { Value } from "../../rendering/react/components/Value.js";

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
  expires: Flags.string({
    description:
      "An interval after which the invitation expires (examples: 30m, 30d, 1y).",
  }),
};

export class Invite extends ExecRenderBaseCommand<
  typeof Invite,
  { inviteId: string }
> {
  static description = "Invite a user to an organization.";
  static flags = { ...orgFlags, ...processFlags, ...inviteFlags };

  protected getExpirationDate(): Date | undefined {
    if (!this.flags.expires) {
      return undefined;
    }

    const d = new Date();
    const i = parseDuration(this.flags.expires);

    if (!i) {
      throw new Error("could not parse duration: " + this.flags.expires);
    }

    return new Date(d.getTime() + i);
  }

  protected async exec(): Promise<{ inviteId: string }> {
    const process = makeProcessRenderer(
      this.flags,
      "Inviting user to organization",
    );
    const customerId = await withOrgId(
      this.apiClient,
      this.flags,
      this.args,
      this.config,
    );

    const invite = await process.runStep("Creating invite", async () => {
      const result = await this.apiClient.customer.createCustomerInvite({
        pathParameters: { customerId },
        data: {
          mailAddress: this.flags.email,
          role: this.flags.role as MembershipCustomerRoles,
          message: this.flags.message,
          membershipExpiresAt: this.getExpirationDate()?.toJSON(),
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
