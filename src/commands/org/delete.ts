import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../lib/basecommands/DeleteBaseCommand.js";
import { orgArgs, withOrgId } from "../../lib/resources/org/flags.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete an organization";
  static resourceName = "organization";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...orgArgs };

  protected async deleteResource(): Promise<void> {
    const customerId = await withOrgId(
      this.apiClient,
      Delete,
      {},
      this.args,
      this.config,
    );
    const response = await this.apiClient.customer.deleteCustomer({
      customerId,
    });

    assertStatus(response, 200);
  }
}
