import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../rendering/Formatter.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { buildCreatedAtColumn } from "../../../lib/viewhelpers/list_column_date.js";

type ResponseItem = Simplify<
  Required<MittwaldAPIV2.Paths.V2UsersSelfSshKeys.Get.Responses.$200.Content.ApplicationJson>["sshKeys"][number]
>;
type Response = Awaited<ReturnType<MittwaldAPIV2Client["user"]["listSshKeys"]>>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "Get your stored ssh keys";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.user.listSshKeys();
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data.sshKeys ?? [];
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      sshKeyId: {
        header: "ID",
        minWidth: 36,
      },
      comment: {},
      fingerprint: {},
      createdAt: buildCreatedAtColumn(this.flags),
    };
  }
}
