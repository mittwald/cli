import React, { FC } from "react";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import { SingleResult } from "../SingleResult.js";
import DnsZone = MittwaldAPIV2.Components.Schemas.DnsZone;
import { Box, Text } from "ink";
import DnsRecordCombinedA = MittwaldAPIV2.Components.Schemas.DnsRecordCombinedA;
import {
  isCustomARecord,
  isCustomMXRecord,
  isManagedARecord,
  isManagedMXRecord,
  isSRVRecord,
  isTXTRecord,
} from "../../../../lib/dnszone/records.js";
import DnsRecordMX = MittwaldAPIV2.Components.Schemas.DnsRecordMX;
import DnsRecordTXT = MittwaldAPIV2.Components.Schemas.DnsRecordTXT;
import DnsRecordSRV = MittwaldAPIV2.Components.Schemas.DnsRecordSRV;

const DnsZoneRecordsA: FC<{ record: DnsRecordCombinedA }> = ({ record }) => {
  if (isManagedARecord(record)) {
    return <Text color="green">managed by mittwald</Text>;
  }

  if (isCustomARecord(record)) {
    return record.a.map((a, idx) => <Text key={idx}>{a}</Text>);
  }

  return <Value notSet />;
};

const DnsZoneRecordsAAAA: FC<{ record: DnsRecordCombinedA }> = ({ record }) => {
  if (isManagedARecord(record)) {
    return <Text color="green">managed by mittwald</Text>;
  }

  if (isCustomARecord(record)) {
    return record.aaaa.map((a, idx) => <Text key={idx}>{a}</Text>);
  }

  return <Value notSet />;
};

const DnsZoneRecordsMX: FC<{ record: DnsRecordMX }> = ({ record }) => {
  if (isManagedMXRecord(record)) {
    return <Text color="green">managed by mittwald</Text>;
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

const DnsZoneRecordsTXT: FC<{ record: DnsRecordTXT }> = ({ record }) => {
  if (isTXTRecord(record)) {
    return record.entries.map((a, idx) => <Value key={idx}>{a}</Value>);
  }

  return <Value notSet />;
};
const DnsZoneRecordsSRV: FC<{ record: DnsRecordSRV }> = ({ record }) => {
  if (isSRVRecord(record)) {
    return record.records.map((a, idx) => (
      <Value key={idx}>
        {a.priority} {a.weight} {a.port} {a.fqdn}
      </Value>
    ));
  }

  return <Value notSet />;
};

const DnsZoneRecords: FC<{ dnsZone: DnsZone }> = ({ dnsZone }) => {
  const rows = {
    A: <DnsZoneRecordsA record={dnsZone.recordSet.combinedARecords} />,
    AAAA: <DnsZoneRecordsAAAA record={dnsZone.recordSet.combinedARecords} />,
    MX: <DnsZoneRecordsMX record={dnsZone.recordSet.mx} />,
    TXT: <DnsZoneRecordsTXT record={dnsZone.recordSet.txt} />,
    SRV: <DnsZoneRecordsSRV record={dnsZone.recordSet.srv} />,
  };
  return <SingleResult title="DNS records" rows={rows} />;
};

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
