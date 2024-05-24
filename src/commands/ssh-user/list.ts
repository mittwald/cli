import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Simplify } from "@mittwald/api-client-commons";
import { SuccessfulResponse } from "../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../rendering/Formatter.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

type SshUserResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserListSftpUsers"]>
>;
type SshUserResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdSftpUsers.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sshUserListSshUsers"]>
>;

export class List extends ListBaseCommand<
  typeof List,
  SshUserResponseItem,
  Response
> {
  static description = "List all SSH users for a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  static aliases = ["project:ssh-user:list"];
  static deprecateAliases = true;

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.sshsftpUser.sshUserListSshUsers({ projectId });
  }

  protected mapData(
    data: SuccessfulResponse<SshUserResponse, 200>["data"],
  ): SshUserResponseItem[] {
    return data;
  }

  protected getColumns(
    data: SshUserResponseItem[],
  ): ListColumns<SshUserResponseItem> {
    const { id, userName, createdAt } = super.getColumns(data, {
      shortIdKey: "userName",
    });
    return {
      id,
      userName,
      description: {},
      active: {},
      createdAt,
    };
  }
}
