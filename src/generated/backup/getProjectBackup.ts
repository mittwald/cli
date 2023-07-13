/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectBackupsProjectBackupId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["backup"]["getProjectBackup"]>
>;

export abstract class GeneratedBackupGetProjectBackup extends GetBaseCommand<
  typeof GeneratedBackupGetProjectBackup,
  APIResponse
> {
  static description = "Get a ProjectBackup.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    projectBackupId: Args.string({
      description: "ID of the ProjectBackup to retrieve.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.backup.getProjectBackup({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.backup.getProjectBackup>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
