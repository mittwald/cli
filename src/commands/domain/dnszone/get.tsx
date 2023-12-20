import { MittwaldAPIV2 } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { RenderBaseCommand } from "../../../rendering/react/RenderBaseCommand.js";
import {
  dnsZoneArgs,
  withDnsZoneId,
} from "../../../lib/domain/dnszone/flags.js";
import React from "react";
import { assertStatus } from "@mittwald/api-client-commons";
import { usePromise } from "@mittwald/react-use-promise";
import { DnsZoneDetails } from "../../../rendering/react/components/DnsZone/DnsZoneDetails.js";
import DnsZone = MittwaldAPIV2.Components.Schemas.DnsZone;
import { RenderJson } from "../../../rendering/react/json/RenderJson.js";

export class Get extends RenderBaseCommand<typeof Get> {
  static description = "gets a specific zone";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };

  static args = {
    ...dnsZoneArgs,
  };

  protected render(): React.ReactNode {
    const dnsZone = usePromise(() => this.getDnsZone(), []);

    if (this.flags.output === "json") {
      return <RenderJson name="dnsZone" data={dnsZone} />;
    }

    return <DnsZoneDetails dnsZone={dnsZone} />;
  }

  protected async getDnsZone(): Promise<DnsZone> {
    const dnsZoneId = await withDnsZoneId(
      this.apiClient,
      Get,
      this.flags,
      this.args,
      this.config,
    );
    const response = await this.apiClient.domain.dnsGetDnsZone({
      dnsZoneId,
    });

    assertStatus(response, 200);

    return response.data;
  }
}
