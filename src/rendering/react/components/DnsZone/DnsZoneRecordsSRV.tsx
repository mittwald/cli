import { RecordComponent } from "./RecordComponent.js";
import { isSRVRecord } from "../../../../lib/domain/dnszone/records.js";
import { Value } from "../Value.js";
import React from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
type DnsRecordSRV = MittwaldAPIV2.Components.Schemas.DnsRecordSRV;

export const DnsZoneRecordsSRV: RecordComponent<DnsRecordSRV> = ({
  record,
}) => {
  if (isSRVRecord(record)) {
    return record.records.map((a, idx) => (
      <Value key={idx}>
        {a.priority} {a.weight} {a.port} {a.fqdn}
      </Value>
    ));
  }

  return <Value notSet />;
};
