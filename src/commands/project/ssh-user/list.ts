/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import {GeneratedSshUserListSshUsers, PathParams} from "../../../generated/sshsftpUser/sshUserListSshUsers.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Simplify } from "@mittwald/api-client-commons";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";

type SshUserResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserListSftpUsers"]>
>;
type SshUserResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdSftpUsers.Get.Responses.$200.Content.ApplicationJson[number]
>;
export default class Get extends GeneratedSshUserListSshUsers<SshUserResponseItem> {
  protected mapData(
    data: SuccessfulResponse<SshUserResponse, 200>["data"],
  ): SshUserResponseItem[] {
    return data;
  }

  protected async mapParams(input: PathParams): Promise<PathParams> {
    input.projectId = await normalizeProjectIdToUuid(
      this.apiClient,
      input.projectId,
    );
    return super.mapParams(input);
  }

  protected getColumns(
    data: SshUserResponseItem[],
  ): ListColumns<SshUserResponseItem> {
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
