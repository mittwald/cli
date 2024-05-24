import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2UsersSelfSessions.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["listSessions"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List all active sessions";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.user.listSessions();
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      tokenId: { header: "ID", minWidth: 36 },
      device: {
        header: "Device",
        get: (row) => `${row.device.browser} on ${row.device.os}`,
      },
      location: {
        header: "Location",
        get: (row) => row.location?.country,
      },
      lastAccess: {
        header: "Last Access",
        get: (row) =>
          row.lastAccess
            ? formatRelativeDate(new Date(`${row.lastAccess}`))
            : "never",
      },
    };
  }
}
