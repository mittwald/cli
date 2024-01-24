import { RecordComponent } from "./RecordComponent.js";
import { isTXTRecord } from "../../../../lib/domain/dnszone/records.js";
import { Value } from "../Value.js";
import React from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import DnsRecordTXT = MittwaldAPIV2.Components.Schemas.DnsRecordTXT;

export const DnsZoneRecordsTXT: RecordComponent<DnsRecordTXT> = ({
  record,
}) => {
  if (isTXTRecord(record)) {
    return record.entries.map((a, idx) => <Value key={idx}>{a}</Value>);
  }

  return <Value notSet />;
};
