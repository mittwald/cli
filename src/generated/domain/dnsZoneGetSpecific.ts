/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DnsZonesZoneId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["dnsZoneGetSpecific"]>
>;

export abstract class GeneratedDnsZoneGetSpecific extends GetBaseCommand<
  typeof GeneratedDnsZoneGetSpecific,
  APIResponse
> {
  static description = "gets a specific zone";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    zoneId: Args.string({
      description: "id of the zone you want to get",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.dnsZoneGetSpecific({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.domain.dnsZoneGetSpecific>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
