import { Simplify } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { ListColumns } from "../../../rendering/Formatter.js";
import { optionalDateRenderer } from "../../../lib/viewhelpers/date.js";
import { makeDateRendererForFlags } from "../../../lib/viewhelpers/list_column_date.js";

type CustomerCustomer = MittwaldAPIV2.Components.Schemas.CustomerCustomer;
type CustomerMembership =
  MittwaldAPIV2.Components.Schemas.MembershipCustomerMembership;

type ResponseItem = Simplify<
  CustomerMembership & {
    org?: CustomerCustomer;
  }
>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomerMemberships"]>
>;

export class ListOwn extends ListBaseCommand<
  typeof ListOwn,
  ResponseItem,
  Response
> {
  static description =
    "List all organization memberships for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    return await this.apiClient.customer.listCustomerMemberships();
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
    const baseColumns = super.getColumns(data);
    const dateRenderer = optionalDateRenderer(
      makeDateRendererForFlags(this.flags),
    );
    return {
      id: baseColumns.id,
      role: {},
      org: {
        get: (item) => item.org?.name ?? "(unknown org)",
      },
      memberSince: {
        header: "Member since",
        get: (item) => dateRenderer(item.memberSince),
      },
    };
  }
}
