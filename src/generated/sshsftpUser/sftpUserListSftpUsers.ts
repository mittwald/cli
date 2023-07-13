/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdSftpUsers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserListSftpUsers"]>
>;

export abstract class GeneratedSftpUserListSftpUsers<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedSftpUserListSftpUsers,
  TItem,
  Response
> {
  static description = "Get all SFTPUsers for a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project to request SFTPUsers for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.sshsftpUser.sftpUserListSftpUsers({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.sshsftpUser.sftpUserListSftpUsers>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
