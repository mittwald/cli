/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomerCategoriesCategoryId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["getCustomerCategory"]>
>;

export abstract class GeneratedCustomerGetCustomerCategory extends GetBaseCommand<
  typeof GeneratedCustomerGetCustomerCategory,
  APIResponse
> {
  static description = "Get a customer category.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    categoryId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.customer.getCustomerCategory({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.customer.getCustomerCategory>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
