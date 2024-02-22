import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { orgFlags, withOrgId } from "../../../lib/org/flags.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";
import UserUser = MittwaldAPIV2.Components.Schemas.UserUser;

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CustomersCustomerIdMemberships.Get.Responses.$200.Content.ApplicationJson[number]
> & {
  user?: UserUser;
};

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
    return {
      id: baseColumns.id,
      role: {},
      user: {
        get: (item) => item.user?.email ?? "(unknown user)",
      },
      memberSince: {
        header: "Member since",
        get: (item) => formatRelativeDate(item.memberSince),
      },
    };
  }
}
