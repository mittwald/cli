/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdInvoiceSettings.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<
    MittwaldAPIV2Client["contract"]["invoiceGetDetailOfInvoiceSettings"]
  >
>;

export abstract class GeneratedInvoiceGetDetailOfInvoiceSettings extends GetBaseCommand<
  typeof GeneratedInvoiceGetDetailOfInvoiceSettings,
  APIResponse
> {
  static description = "Get InvoiceSettings of a Customer.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.invoiceGetDetailOfInvoiceSettings({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.invoiceGetDetailOfInvoiceSettings>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
