import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";

import ListDateColumnFormatter from "../../../rendering/formatter/ListDateColumnFormatter.js";

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
    const dateColumnBuilder = new ListDateColumnFormatter(this.flags);
    const createdAt = dateColumnBuilder.buildColumn();
    const expiresAt = dateColumnBuilder.buildColumn({
      header: "Expires at",
      column: "expiresAt",
      fallback: "never",
    });

    return {
      apiTokenId: { header: "ID", minWidth: 36 },
      description: {},
      createdAt,
      expiresAt,
    };
  }
}
