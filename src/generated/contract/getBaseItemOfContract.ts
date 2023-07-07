/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ContractsContractIdBaseItems.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getBaseItemOfContract"]>
>;

export abstract class GeneratedContractGetBaseItemOfContract extends GetBaseCommand<
  typeof GeneratedContractGetBaseItemOfContract,
  APIResponse
> {
  static description = "Return the BaseItem of the Contract with the given ID.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "contract-id": Flags.string({
      description:
        "The uuid of the Contract from which the BaseItem is to be issued.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getBaseItemOfContract({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getBaseItemOfContract>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
