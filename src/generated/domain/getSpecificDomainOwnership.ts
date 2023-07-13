/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DomainOwnershipsDomainOwnershipId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["getSpecificDomainOwnership"]>
>;

export abstract class GeneratedDomainGetSpecificDomainOwnership extends GetBaseCommand<
  typeof GeneratedDomainGetSpecificDomainOwnership,
  APIResponse
> {
  static description = "Get a domain ownership.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    domainOwnershipId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.getSpecificDomainOwnership({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.domain.getSpecificDomainOwnership>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
