import { RecordComponent } from "./RecordComponent.js";
import {
  isCustomARecord,
  isManagedARecord,
} from "../../../../lib/domain/dnszone/records.js";
import { RecordSetManagedByMittwald } from "./RecordSetManagedByMittwald.js";
import { RecordSetValues } from "./RecordSetValues.js";
import { Value } from "../Value.js";
import React from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import DnsRecordCombinedA = MittwaldAPIV2.Components.Schemas.DnsRecordCombinedA;

export const DnsZoneRecordsAAAA: RecordComponent<DnsRecordCombinedA> = ({
  record,
}) => {
  if (isManagedARecord(record)) {
    return <RecordSetManagedByMittwald />;
  }

  if (isCustomARecord(record) && record.aaaa.length > 0) {
    return <RecordSetValues records={record.aaaa} />;
  }

  return <Value notSet />;
};
