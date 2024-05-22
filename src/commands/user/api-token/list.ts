import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { buildCreatedAtColumn } from "../../../lib/viewhelpers/list_column_date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2UsersSelfApiTokens.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["listApiTokens"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List all API tokens of the user";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.user.listApiTokens();
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    const createdAt = buildCreatedAtColumn(this.flags);
    return {
      apiTokenId: { header: "ID", minWidth: 36 },
      description: {},
      createdAt,
      expiresAt: {
        header: "Expires at",
        get: (r) =>
          r.expiresAt
            ? formatRelativeDate(new Date(`${r.expiresAt}`))
            : "never",
      },
    };
  }
}
