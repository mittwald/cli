/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdBackups.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["backup"]["listProjectBackups"]>
>;

export abstract class GeneratedBackupListProjectBackups<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedBackupListProjectBackups,
  TItem,
  Response
> {
  static description = "List Backups for a given Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project to get Backups for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.backup.listProjectBackups({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.backup.listProjectBackups>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
