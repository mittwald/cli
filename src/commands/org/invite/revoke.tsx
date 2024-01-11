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
  static description = "Revoke an invite to an organization";
  static flags = { ...processFlags };
  static args = {
    "invite-id": Args.string({
      description: "The ID of the invite to revoke",
      required: true,
    }),
  };

  protected async exec(): Promise<{ deleted: boolean }> {
    const inviteId = this.args["invite-id"];
    const process = makeProcessRenderer(this.flags, "Revoking invite");

    const invite = await process.runStep("Fetching invite", async () => {
      const response = await this.apiClient.customer.getCustomerInvite({
        customerInviteId: inviteId,
      });
      assertStatus(response, 200);
      return response.data;
    });

    await process.runStep("Revoking invite", async () => {
      const response = await this.apiClient.customer.deleteCustomerInvite({
        customerInviteId: inviteId,
      });

      assertStatus(response, 204);
    });

    process.complete(
      <Success>
        Invite for user <Value>{invite.mailAddress}</Value> was successfully
        revoked.
      </Success>,
    );

    return { deleted: true };
  }

  protected render(): ReactNode {
    return undefined;
  }
}
