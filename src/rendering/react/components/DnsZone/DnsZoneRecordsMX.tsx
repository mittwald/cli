import { RecordComponent } from "./RecordComponent.js";
import {
  isCustomMXRecord,
  isManagedMXRecord,
} from "../../../../lib/dnszone/records.js";
import { RecordSetManagedByMittwald } from "./RecordSetManagedByMittwald.js";
import { Value } from "../Value.js";
import React from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import DnsRecordMX = MittwaldAPIV2.Components.Schemas.DnsRecordMX;

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
