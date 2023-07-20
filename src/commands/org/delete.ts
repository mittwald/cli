import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import { projectArgs } from "../../lib/project/flags.js";
import { withOrgId } from "../../lib/org/flags.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete an organization";
  static resourceName = "organization";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = { ...projectArgs };

  protected async deleteResource(): Promise<void> {
    const customerId = await withOrgId(
      this.apiClient,
      {},
      this.args,
      this.config,
    );
    const response = await this.apiClient.customer.deleteCustomer({
      pathParameters: { customerId },
    });

    assertStatus(response, 200);
  }
}
