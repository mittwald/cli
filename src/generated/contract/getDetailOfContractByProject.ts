/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdContract.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["getDetailOfContractByProject"]>
>;

export abstract class GeneratedContractGetDetailOfContractByProject extends GetBaseCommand<
  typeof GeneratedContractGetDetailOfContractByProject,
  APIResponse
> {
  static description = "Return the Contract for the given Project.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.contract.getDetailOfContractByProject({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.contract.getDetailOfContractByProject>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
