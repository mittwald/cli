/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdOrders.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["contract"]["orderListProjectOrders"]>
>;

export abstract class GeneratedOrderListProjectOrders<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedOrderListProjectOrders,
  TItem,
  Response
> {
  static description = "Get list of Orders of a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.contract.orderListProjectOrders({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.contract.orderListProjectOrders>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
