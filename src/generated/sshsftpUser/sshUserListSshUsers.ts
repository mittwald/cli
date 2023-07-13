/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdSshUsers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sshUserListSshUsers"]>
>;

export abstract class GeneratedSshUserListSshUsers<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedSshUserListSshUsers,
  TItem,
  Response
> {
  static description = "Get all SSHUsers for a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project to retrieve SSHUsers for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.sshsftpUser.sshUserListSshUsers({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.sshsftpUser.sshUserListSshUsers>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
