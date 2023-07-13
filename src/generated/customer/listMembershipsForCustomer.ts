/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdMemberships.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listMembershipsForCustomer"]>
>;

export abstract class GeneratedCustomerListMembershipsForCustomer<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedCustomerListMembershipsForCustomer,
  TItem,
  Response
> {
  static description = "List all memberships belonging to a Customer.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description: "Customer to list memberships for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      customerId: this.flags["customer-id"],
    };
    return await this.apiClient.customer.listMembershipsForCustomer({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.customer.listMembershipsForCustomer>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
