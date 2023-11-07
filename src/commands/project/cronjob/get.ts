import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["getCronjob"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a cron job.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "cronjob-id": Args.string({
      description: "ID of the cron job to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.cronjob.getCronjob({
      cronjobId: this.args["cronjob-id"],
    });
  }
}
