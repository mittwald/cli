/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvoices.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["invoiceListCustomerInvoices"]>
>;

export abstract class GeneratedInvoiceListCustomerInvoices<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedInvoiceListCustomerInvoices,
  TItem,
  Response
> {
  static description = "List Invoices of a Customer.";

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
    return await this.apiClient.contract.invoiceListCustomerInvoices({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.contract.invoiceListCustomerInvoices>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
