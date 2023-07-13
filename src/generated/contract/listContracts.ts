/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomersCustomerIdContracts.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["listContracts"]>
>;

export abstract class GeneratedContractListContracts<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedContractListContracts,
  TItem,
  Response
> {
  static description = "Return a list of Contracts for the given Customer.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "customer-id": Flags.string({
      description:
        "The uuid of the Customer from whom all Contracts are to be returned.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      customerId: this.flags["customer-id"],
    };
    return await this.apiClient.contract.listContracts({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.contract.listContracts>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
