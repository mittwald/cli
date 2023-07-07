/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ToplevelDomains.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["listToplevelDomains"]>
>;

export abstract class GeneratedDomainListToplevelDomains<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedDomainListToplevelDomains,
  TItem,
  Response
> {
  static description = "List all supported toplevel domains.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.domain.listToplevelDomains({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.domain.listToplevelDomains>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
