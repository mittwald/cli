import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Simplify } from "@mittwald/api-client-commons";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";

type SftpUserResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdSftpUsers.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserListSftpUsers"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  SftpUserResponseItem,
  Response
> {
  static description = "List all SFTP users for a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  static aliases = ["project:sftp-user:list"];
  static deprecateAliases = true;

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.sshsftpUser.sftpUserListSftpUsers({
      projectId,
    });
  }

  protected getColumns(
    data: SftpUserResponseItem[],
  ): ListColumns<SftpUserResponseItem> {
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
