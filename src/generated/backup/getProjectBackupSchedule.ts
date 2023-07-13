/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectBackupSchedulesProjectBackupScheduleId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["backup"]["getProjectBackupSchedule"]>
>;

export abstract class GeneratedBackupGetProjectBackupSchedule extends GetBaseCommand<
  typeof GeneratedBackupGetProjectBackupSchedule,
  APIResponse
> {
  static description = "Get a ProjectBackupSchedule.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    projectBackupScheduleId: Args.string({
      description: "ID of the ProjectBackupSchedule to retrieve.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.backup.getProjectBackupSchedule({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.backup.getProjectBackupSchedule>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
