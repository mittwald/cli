/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdOrders.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["orderListCustomerOrders"]>
>;

export abstract class GeneratedOrderListCustomerOrders<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedOrderListCustomerOrders,
  TItem,
  Response
> {
  static description = "Get list of Orders of a Customer.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      customerId: this.flags["customer-id"],
    };
    return await this.apiClient.contract.orderListCustomerOrders({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.contract.orderListCustomerOrders>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
