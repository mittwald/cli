import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DnsZonesDnsZoneId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["dnsGetDnsZone"]>
>;

export abstract class Get extends GetBaseCommand<typeof Get, APIResponse> {
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
    return await this.apiClient.domain.dnsGetDnsZone({
      dnsZoneId: this.args.zoneId,
    });
  }
}
