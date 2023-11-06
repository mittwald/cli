import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { Args } from "@oclif/core";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["getCronjob"]>
>;

export class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a cronjob.";
  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    cronjobId: Args.string({
      description: "ID of the cronjob to be retrieved.",
      required: true,
    }),
  };

  static aliases = ["project:cronjob:get"];
  static deprecateAliases = true;

  protected async getData(): Promise<APIResponse> {
    const { cronjobId } = this.args;
    return await this.apiClient.cronjob.getCronjob({ cronjobId });
  }
}
