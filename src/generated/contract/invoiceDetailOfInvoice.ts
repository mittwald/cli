/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvoicesInvoiceId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["invoiceDetailOfInvoice"]>
>;

export abstract class GeneratedInvoiceDetailOfInvoice extends GetBaseCommand<
  typeof GeneratedInvoiceDetailOfInvoice,
  APIResponse
> {
  static description = "Get details of an Invoice.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {
    invoiceId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.invoiceDetailOfInvoice({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.invoiceDetailOfInvoice>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
