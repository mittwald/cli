import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { formatCreatedAt } from "../../../lib/viewhelpers/date.js";
import { ListColumns } from "../../../Formatter.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";

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
      created: {
        header: "Created at",
        get: formatCreatedAt,
      },
    };
  }
}
