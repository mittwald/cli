/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DomainsHandleSchemaDomainName.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["getHandleFields"]>
>;

export abstract class GeneratedDomainGetHandleFields extends GetBaseCommand<
  typeof GeneratedDomainGetHandleFields,
  APIResponse
> {
  static description = "Get a HandleSchema.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    domainName: Args.string({
      description: "The whole domain name",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.getHandleFields({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.domain.getHandleFields>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
