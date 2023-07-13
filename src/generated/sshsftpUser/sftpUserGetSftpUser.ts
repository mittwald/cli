/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SftpUsersSftpUserId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserGetSftpUser"]>
>;

export abstract class GeneratedSftpUserGetSftpUser extends GetBaseCommand<
  typeof GeneratedSftpUserGetSftpUser,
  APIResponse
> {
  static description = "Get an SFTPUser.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    sftpUserId: Args.string({
      description: "ID of the SFTPUser to get.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.sshsftpUser.sftpUserGetSftpUser({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.sshsftpUser.sftpUserGetSftpUser>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
