import { Simplify } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";

type CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;
type CustomerInvite = MittwaldAPIV2.Components.Schemas.MembershipCustomerInvite;

type ResponseItem = Simplify<CustomerInvite & { org?: CustomerCustomer }>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomerInvites"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List all organization invites for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.customer.listCustomerInvites();
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
