/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ToplevelDomainsTld.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["getToplevelDomain"]>
>;

export abstract class GeneratedDomainGetToplevelDomain extends GetBaseCommand<
  typeof GeneratedDomainGetToplevelDomain,
  APIResponse
> {
  static description = "Get a toplevel domain.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    tld: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.getToplevelDomain({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.domain.getToplevelDomain>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
