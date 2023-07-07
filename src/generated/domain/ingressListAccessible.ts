/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2Ingresses.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["ingressListAccessible"]>
>;

export abstract class GeneratedIngressListAccessible<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedIngressListAccessible,
  TItem,
  Response
> {
  static description = "List Ingresses the user has access to.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.domain.ingressListAccessible({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.domain.ingressListAccessible>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
