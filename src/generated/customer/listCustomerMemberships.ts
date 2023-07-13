/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomerMemberships.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["listCustomerMemberships"]>
>;

export abstract class GeneratedCustomerListCustomerMemberships<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedCustomerListCustomerMemberships,
  TItem,
  Response
> {
  static description = "List all CustomerMemberships for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.customer.listCustomerMemberships({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.customer.listCustomerMemberships>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
