/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ContractsContractIdItemsContractItemId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getDetailOfContractItem"]>
>;

export abstract class GeneratedContractGetDetailOfContractItem extends GetBaseCommand<
  typeof GeneratedContractGetDetailOfContractItem,
  APIResponse
> {
  static description = "Get the ContractItem with the given ID.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "contract-id": Flags.string({
      description:
        "The uuid of the Contract where the desired ContractItem belongs to.",
      required: true,
    }),
  };
  static args = {
    contractItemId: Args.string({
      description: "The uuid of the ContractItem to be returned.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getDetailOfContractItem({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getDetailOfContractItem>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
