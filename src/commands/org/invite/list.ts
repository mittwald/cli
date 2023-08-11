import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { orgFlags, withOrgId } from "../../../lib/org/flags.js";
import { ListColumns } from "../../../Formatter.js";
import { formatRelativeDate } from "../../../lib/viewhelpers/date.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvites.Get.Responses.$200.Content.ApplicationJson[number]
>;
export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvites.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listInvitesForCustomer"]>
>;

export abstract class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List all invites for an organization.";

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

    return await this.apiClient.customer.listInvitesForCustomer({
      pathParameters: { customerId },
    } as Parameters<typeof this.apiClient.customer.listInvitesForCustomer>[0]);
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    return {
      id: super.getColumns(data).id,
      role: {},
      email: {
        get: (item) => item.mailAddress,
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
