/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdLegallyCompetent.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["isCustomerLegallyCompetent"]>
>;

export abstract class GeneratedCustomerIsCustomerLegallyCompetent extends GetBaseCommand<
  typeof GeneratedCustomerIsCustomerLegallyCompetent,
  APIResponse
> {
  static description =
    "Check if the customer profile has a valid contract partner configured.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.customer.isCustomerLegallyCompetent({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.customer.isCustomerLegallyCompetent>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
