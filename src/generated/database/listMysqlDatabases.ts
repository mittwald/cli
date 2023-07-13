/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMysqlDatabases.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["database"]["listMysqlDatabases"]>
>;

export abstract class GeneratedDatabaseListMysqlDatabases<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedDatabaseListMysqlDatabases,
  TItem,
  Response
> {
  static description = "List MySQLDatabases belonging to a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project to list MySQLDatabases for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.database.listMysqlDatabases({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.database.listMysqlDatabases>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
