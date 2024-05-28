import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import ListDateColumnFormatter from "../../../rendering/formatter/ListDateColumnFormatter.js";

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

  protected getColumns(): ListColumns<ResponseItem> {
    const dateColumnBuilder = new ListDateColumnFormatter(this.flags);
    const lastAccess = dateColumnBuilder.buildColumn({
      header: "Last access",
      column: "lastAccess",
      fallback: "(never)",
    });

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
      lastAccess,
    };
  }
}
