import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { mysqlArgs } from "../../../lib/database/mysql/flags.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlDatabasesId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["getMysqlDatabase"]>
>;

export abstract class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a MySQLDatabase.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    ...mysqlArgs,
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.database.getMysqlDatabase({
      pathParameters: { id: this.args["database-id"] },
    } as Parameters<typeof this.apiClient.database.getMysqlDatabase>[0]);
  }
}
