import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { formatRelativeDate } from "../../rendering/textformat/formatDate.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Conversations.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["conversation"]["listConversations"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description =
    "Get all conversations the authenticated user has created or has access to.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.conversation.listConversations();
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      conversationId: {
        header: "UUID",
        minWidth: 36,
        extended: true,
      },
      shortId: {
        header: "ID",
        minWidth: 8,
      },
      status: {},
      title: {},
      created: {
        header: "Created",
        get: (row) =>
          formatRelativeDate(new Date(`${row.createdAt}`)) +
          " by " +
          (row.createdBy ? row.createdBy.clearName : "unknown"),
      },
    };
  }
}
