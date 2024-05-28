import { RecordComponent } from "./RecordComponent.js";
import {
  isCustomARecord,
  isManagedARecord,
} from "../../../../lib/resources/domain/dnszone/records.js";
import { RecordSetManagedByMittwald } from "./RecordSetManagedByMittwald.js";
import { RecordSetValues } from "./RecordSetValues.js";
import { Value } from "../Value.js";
import React from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
type DnsRecordCombinedA = MittwaldAPIV2.Components.Schemas.DnsRecordCombinedA;

export const DnsZoneRecordsA: RecordComponent<DnsRecordCombinedA> = ({
  record,
}) => {
  if (isManagedARecord(record)) {
    return <RecordSetManagedByMittwald />;
  }

  if (isCustomARecord(record) && record.a.length > 0) {
    return <RecordSetValues records={record.a} />;
  }

  return <Value notSet />;
};
