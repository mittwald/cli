import { RecordComponent } from "./RecordComponent.js";
import {
  isCustomMXRecord,
  isManagedMXRecord,
} from "../../../../lib/domain/dnszone/records.js";
import { RecordSetManagedByMittwald } from "./RecordSetManagedByMittwald.js";
import { Value } from "../Value.js";
import React from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
type DnsRecordMX = MittwaldAPIV2.Components.Schemas.DnsRecordMX;

export const DnsZoneRecordsMX: RecordComponent<DnsRecordMX> = ({ record }) => {
  if (isManagedMXRecord(record)) {
    return <RecordSetManagedByMittwald />;
  }

  if (isCustomMXRecord(record)) {
    return record.records.map((a, idx) => (
      <Value key={idx}>
        {a.priority} {a.fqdn}
      </Value>
    ));
  }

  return <Value notSet />;
};
