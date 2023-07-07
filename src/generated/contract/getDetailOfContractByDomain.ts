/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DomainsDomainIdContract.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getDetailOfContractByDomain"]>
>;

export abstract class GeneratedContractGetDetailOfContractByDomain extends GetBaseCommand<
  typeof GeneratedContractGetDetailOfContractByDomain,
  APIResponse
> {
  static description = "Return the Contract for the given Domain.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "domain-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getDetailOfContractByDomain({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getDetailOfContractByDomain>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
