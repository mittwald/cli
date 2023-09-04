import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CustomerInvites.Get.Responses.$200.Content.ApplicationJson[number]
> & { org?: CustomerCustomer };
export type PathParams =
  MittwaldAPIV2.Paths.V2CustomerInvites.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomerInvites"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List all organization invites for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.customer.listCustomerInvites({
      pathParameters: {},
    } as Parameters<typeof this.apiClient.customer.listCustomerInvites>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return Promise.all(
      data.map(async (item) => {
        const { customerId } = item;
        const org = await this.apiClient.customer.getCustomer({
          customerId,
        });

        if (org.status === 200) {
          return { ...item, org: org.data };
        }
        return item;
      }),
    );
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      id: super.getColumns(data).id,
      role: {},
      org: {
        get: (item) => item.org?.name ?? "(unknown org)",
      },
      expiresAt: {
        header: "Expires",
        get: (item) =>
          item.membershipExpiresAt
            ? formatRelativeDate(item.membershipExpiresAt)
            : "(never)",
      },
    };
  }
}
