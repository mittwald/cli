/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ContractsContractIdItemsContractItemIdNextTerminationDates.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getNextTerminationDateForItem"]>
>;

export abstract class GeneratedContractGetNextTerminationDateForItem extends GetBaseCommand<
  typeof GeneratedContractGetNextTerminationDateForItem,
  APIResponse
> {
  static description =
    "Return the next TerminationDate for the ContractItem with the given ID.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "contract-id": Flags.string({
      description:
        "The uuid of the Contract where the desired ContractItem belongs to.",
      required: true,
    }),
    "contract-item-id": Flags.string({
      description:
        "The uuid of the ContractItem whose next TerminationDate is to be displayed.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getNextTerminationDateForItem({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getNextTerminationDateForItem>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
