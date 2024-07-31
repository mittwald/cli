import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { orgFlags, withOrgId } from "../../../lib/resources/org/flags.js";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import ListDateColumnFormatter from "../../../rendering/formatter/ListDateColumnFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvites.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
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
      customerId,
    });
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const dateColumnBuilder = new ListDateColumnFormatter(this.flags);
    const expiresAt = dateColumnBuilder.buildColumn({
      header: "Expires",
      column: "membershipExpiresAt",
      fallback: "(never)",
    });
    return {
      id: super.getColumns(data).id,
      role: {},
      email: {
        get: (item) => item.mailAddress,
      },
      expiresAt,
    };
  }
}
