import React, { FC } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import { SingleResult } from "../SingleResult.js";
import { Box } from "ink";
import { DnsZoneRecords } from "./DnsZoneRecords.js";
import DnsZone = MittwaldAPIV2.Components.Schemas.DnsZone;

export const DnsZoneDetails: FC<{ dnsZone: DnsZone }> = ({ dnsZone }) => {
  const title = (
    <>
      DNS Zone: <Value>{dnsZone.domain}</Value>
    </>
  );

  const rows = {
    ID: <Value>{dnsZone.id}</Value>,
  };
  const sections = [
    <SingleResult key="primary" title={title} rows={rows} />,
    <DnsZoneRecords key="records" dnsZone={dnsZone} />,
  ];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};
