/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2MysqlUsersIdPhpMyAdminUrl.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["getMysqlUserPhpMyAdminUrl"]>
>;

export abstract class GeneratedDatabaseGetMysqlUserPhpMyAdminUrl extends GetBaseCommand<
  typeof GeneratedDatabaseGetMysqlUserPhpMyAdminUrl,
  APIResponse
> {
  static description = "Get a MySQLUser's PhpMyAdmin-URL.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    id: Flags.string({
      description: "ID of the MySQLUser for which to get the URL for.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.database.getMysqlUserPhpMyAdminUrl({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.database.getMysqlUserPhpMyAdminUrl>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
