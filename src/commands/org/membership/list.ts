import { Simplify } from "@mittwald/api-client-commons";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { orgFlags, withOrgId } from "../../../lib/resources/org/flags.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { makeDateRendererForFlags } from "../../../lib/viewhelpers/list_column_date.js";
import maybe from "../../../lib/util/maybe.js";

type UserUser = MittwaldAPIV2.Components.Schemas.UserUser;
type CustomerMembership =
  MittwaldAPIV2.Components.Schemas.MembershipCustomerMembership;

type ResponseItem = Simplify<
  CustomerMembership & {
    user?: UserUser;
  }
>;

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdMemberships.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listMembershipsForCustomer"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List all memberships belonging to an organization.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...orgFlags,
  };

  public async getData(): Promise<Response> {
    const customerId = await withOrgId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );

    return await this.apiClient.customer.listMembershipsForCustomer({
      customerId,
    } as Parameters<
      typeof this.apiClient.customer.listMembershipsForCustomer
    >[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return Promise.all(
      data.map(async (item) => {
        const { userId } = item;
        const user = await this.apiClient.user.getUser({
          userId,
        });

        if (user.status === 200) {
          return { ...item, user: user.data };
        }
        return item;
      }),
    );
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    const dateRenderer = maybe(makeDateRendererForFlags(this.flags));
    return {
      id: baseColumns.id,
      role: {},
      user: {
        get: (item) => item.user?.email ?? "(unknown user)",
      },
      memberSince: {
        header: "Member since",
        get: (item) => dateRenderer(item.memberSince),
      },
    };
  }
}
