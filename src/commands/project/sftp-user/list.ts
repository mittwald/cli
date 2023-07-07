/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { GeneratedSftpUserListSftpUsers, PathParams } from "../../../generated/sshsftpUser/sftpUserListSftpUsers.js";
import { normalizeProjectIdToUuid } from "../../../Helpers.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Simplify } from "@mittwald/api-client-commons";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";

type SftpUserResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["sshsftpUser"]["sftpUserListSftpUsers"]>
>;
type SftpUserResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdSftpUsers.Get.Responses.$200.Content.ApplicationJson[number]
>;

export default class List extends GeneratedSftpUserListSftpUsers<SftpUserResponseItem> {
  protected mapData(
    data: SuccessfulResponse<SftpUserResponse, 200>["data"],
  ): SftpUserResponseItem[] {
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
