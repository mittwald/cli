/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ServersServerIdContract.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getDetailOfContractByServer"]>
>;

export abstract class GeneratedContractGetDetailOfContractByServer extends GetBaseCommand<
  typeof GeneratedContractGetDetailOfContractByServer,
  APIResponse
> {
  static description = "Return the Contract for the given Server.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "server-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getDetailOfContractByServer({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getDetailOfContractByServer>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
