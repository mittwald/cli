import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

type PathParams = MittwaldAPIV2.Paths.V2CronjobsCronjobId.Get.Parameters.Path;
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

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
