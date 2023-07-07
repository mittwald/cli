/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2Customers.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomers"]>
>;

export abstract class GeneratedCustomerListCustomers<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedCustomerListCustomers,
  TItem,
  Response
> {
  static description =
    "Get all customer profiles the authenticated user has access to.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.customer.listCustomers({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.customer.listCustomers>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
