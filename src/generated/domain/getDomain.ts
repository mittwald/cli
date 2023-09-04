/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DomainsDomainId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["getDomain"]>
>;

export abstract class GeneratedDomainGetDomain extends GetBaseCommand<
  typeof GeneratedDomainGetDomain,
  APIResponse
> {
  static description = "Get a Domain.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    domainId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.getDomain({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.domain.getDomain>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
