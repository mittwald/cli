import React, { FC } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import { SingleResult } from "../SingleResult.js";
import { Box } from "ink";
import { DnsZoneRecords } from "./DnsZoneRecords.js";
type DnsZone = MittwaldAPIV2.Components.Schemas.DnsZone;

export const DnsZoneDetails: FC<{ dnsZone: DnsZone }> = ({ dnsZone }) => {
  const title = (
    <>
      DNS Zone: <Value>{dnsZone.domain}</Value>
    </>
  );

  const rows = {
    ID: <Value>{dnsZone.id}</Value>,
  };
  return (
    <Box flexDirection="column" marginBottom={1}>
      <SingleResult title={title} rows={rows} />
      <DnsZoneRecords dnsZone={dnsZone} />
    </Box>
  );
};
