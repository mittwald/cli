import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../../GetBaseCommand.js";
import { Args } from "@oclif/core";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["getMysqlUser"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a MySQL user.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "ID of the MySQL user to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.database.getMysqlUser({
      mysqlUserId: this.args.id,
    });
  }
}
