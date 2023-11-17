import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Simplify } from "@mittwald/api-client-commons";
import { SuccessfulResponse } from "../../types.js";
import { ListColumns } from "../../Formatter.js";
import { ListBaseCommand } from "../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../lib/project/flags.js";

type SftpUserResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserListSftpUsers"]>
>;
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
    const projectId = await withProjectId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.sshsftpUser.sftpUserListSftpUsers({
      projectId,
    });
  }

  protected mapData(
    data: SuccessfulResponse<SftpUserResponse, 200>["data"],
  ): SftpUserResponseItem[] {
    return data;
  }

  protected getColumns(
    data: SftpUserResponseItem[],
  ): ListColumns<SftpUserResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      userName: { header: "Username" },
      description: {},
      active: {},
      createdAt: baseColumns.createdAt,
    };
  }
}
