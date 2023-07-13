/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdBackupSchedules.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["backup"]["listProjectBackupSchedules"]>
>;

export abstract class GeneratedBackupListProjectBackupSchedules<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedBackupListProjectBackupSchedules,
  TItem,
  Response
> {
  static description = "List BackupSchedules belonging to a given Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project to list BackupSchedules for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.backup.listProjectBackupSchedules({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.backup.listProjectBackupSchedules>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
