/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ContractsContractId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getDetailOfContract"]>
>;

export abstract class GeneratedContractGetDetailOfContract extends GetBaseCommand<
  typeof GeneratedContractGetDetailOfContract,
  APIResponse
> {
  static description = "Returns the Contract with the given ID.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    contractId: Args.string({
      description: "The uuid of the Contract to be returned.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getDetailOfContract({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getDetailOfContract>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
