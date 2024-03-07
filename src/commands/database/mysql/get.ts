import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { mysqlArgs, withMySQLId } from "../../../lib/database/mysql/flags.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlDatabasesMysqlDatabaseId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["getMysqlDatabase"]>
>;

export abstract class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a MySQLDatabase.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = { ...mysqlArgs };

  protected async getData(): Promise<APIResponse> {
    const mysqlDatabaseId = await withMySQLId(
      this.apiClient,
      this.flags,
      this.args,
    );
    return await this.apiClient.database.getMysqlDatabase({
      mysqlDatabaseId,
    });
  }
}
