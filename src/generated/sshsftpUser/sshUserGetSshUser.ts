/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SshUsersSshUserId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sshUserGetSshUser"]>
>;

export abstract class GeneratedSshUserGetSshUser extends GetBaseCommand<
  typeof GeneratedSshUserGetSshUser,
  APIResponse
> {
  static description = "Get an SSHUser.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    sshUserId: Args.string({
      description: "ID of the SSHUser to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.sshsftpUser.sshUserGetSshUser({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.sshsftpUser.sshUserGetSshUser>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
