import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../../lib/basecommands/DeleteBaseCommand.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a mail delivery box";
  static resourceName = "mail delivery box";

  static flags = {
    ...DeleteBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "Mail delivery box ID",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const response = await this.apiClient.mail.deleteDeliveryBox({
      deliveryBoxId: this.args.id,
    });

    assertStatus(response, 204);
  }
}
