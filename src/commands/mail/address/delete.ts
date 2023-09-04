import { Args } from "@oclif/core";
import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../../DeleteBaseCommand.js";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a mail address";
  static resourceName = "mail address";

  static flags = {
    ...DeleteBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "Mail address ID",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const response = await this.apiClient.mail.mailaddressDelete({
      id: this.args.id,
    });

    assertStatus(response, 200);
  }
}
