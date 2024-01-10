import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { Success } from "../../../rendering/react/components/Success.js";
import { Value } from "../../../rendering/react/components/Value.js";

export class Revoke extends ExecRenderBaseCommand<
  typeof Revoke,
  { deleted: boolean }
> {
  static description = "Revoke a user's membership to an organization";
  static flags = { ...processFlags };
  static args = {
    "membership-id": Args.string({
      description: "The ID of the membership to revoke",
      required: true,
    }),
  };

  protected async exec(): Promise<{ deleted: boolean }> {
    const membershipId = this.args["membership-id"];
    const process = makeProcessRenderer(
      this.flags,
      "Revoking organization membership",
    );

    const user = await process.runStep("Fetching existing member", async () => {
      const memberResponse =
        await this.apiClient.customer.getCustomerMembership({
          customerMembershipId: membershipId,
        });
      assertStatus(memberResponse, 200);

      const userResponse = await this.apiClient.user.getUser({
        userId: memberResponse.data.userId,
      });
      assertStatus(userResponse, 200);

      return userResponse.data;
    });

    await process.runStep("Revoking membership", async () => {
      const response = await this.apiClient.customer.deleteCustomerMembership({
        customerMembershipId: membershipId,
      });

      assertStatus(response, 204);
    });

    process.complete(
      <Success>
        User <Value>{user.email}</Value> was removed from the organization.
      </Success>,
    );

    return { deleted: true };
  }

  protected render(): ReactNode {
    return undefined;
  }
}
