/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvites.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listInvitesForCustomer"]>
>;

export abstract class GeneratedCustomerListInvitesForCustomer<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedCustomerListInvitesForCustomer,
  TItem,
  Response
> {
  static description = "List all invites for a Customer.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description: "ID of the Customer to list invites for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      customerId: this.flags["customer-id"],
    };
    return await this.apiClient.customer.listInvitesForCustomer({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.customer.listInvitesForCustomer>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
