import React, { FC } from "react";
import { DnsZoneRecordsA } from "./DnsZoneRecordsA.js";
import { DnsZoneRecordsAAAA } from "./DnsZoneRecordsAAAA.js";
import { DnsZoneRecordsMX } from "./DnsZoneRecordsMX.js";
import { DnsZoneRecordsTXT } from "./DnsZoneRecordsTXT.js";
import { DnsZoneRecordsSRV } from "./DnsZoneRecordsSRV.js";
import { SingleResult } from "../SingleResult.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import DnsZone = MittwaldAPIV2.Components.Schemas.DnsZone;

export const DnsZoneRecords: FC<{ dnsZone: DnsZone }> = ({ dnsZone }) => {
  const rows = {
    A: <DnsZoneRecordsA record={dnsZone.recordSet.combinedARecords} />,
    AAAA: <DnsZoneRecordsAAAA record={dnsZone.recordSet.combinedARecords} />,
    MX: <DnsZoneRecordsMX record={dnsZone.recordSet.mx} />,
    TXT: <DnsZoneRecordsTXT record={dnsZone.recordSet.txt} />,
    SRV: <DnsZoneRecordsSRV record={dnsZone.recordSet.srv} />,
  };
  return <SingleResult title="DNS records" rows={rows} />;
};
