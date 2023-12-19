import { assertStatus } from "@mittwald/api-client-commons";
import { DeleteBaseCommand } from "../../DeleteBaseCommand.js";
import { Args } from "@oclif/core";

export default class Delete extends DeleteBaseCommand<typeof Delete> {
  static description = "Delete a cron job";
  static resourceName = "cron job";

  static flags = { ...DeleteBaseCommand.baseFlags };
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cronjob to be deleted.",
      required: true,
    }),
  };

  protected async deleteResource(): Promise<void> {
    const { "cronjob-id": cronjobId } = this.args;
    const response = await this.apiClient.cronjob.deleteCronjob({
      cronjobId,
    });

    assertStatus(response, 200);
  }
}
