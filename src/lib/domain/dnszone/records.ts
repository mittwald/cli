import type { MittwaldAPIV2 } from "@mittwald/api-client";

type DnsRecordCombinedA = MittwaldAPIV2.Components.Schemas.DnsRecordCombinedA;
type DnsCombinedAManaged = MittwaldAPIV2.Components.Schemas.DnsCombinedAManaged;
type DnsRecordMX = MittwaldAPIV2.Components.Schemas.DnsRecordMX;
type DnsRecordMXManaged = MittwaldAPIV2.Components.Schemas.DnsRecordMXManaged;
type DnsCombinedACustom = MittwaldAPIV2.Components.Schemas.DnsCombinedACustom;
type DnsRecordMXCustom = MittwaldAPIV2.Components.Schemas.DnsRecordMXCustom;
type DnsRecordTXT = MittwaldAPIV2.Components.Schemas.DnsRecordTXT;
type DnsRecordTXTComponent =
  MittwaldAPIV2.Components.Schemas.DnsRecordTXTComponent;
type DnsRecordSRVComponent =
  MittwaldAPIV2.Components.Schemas.DnsRecordSRVComponent;
type DnsRecordSRV = MittwaldAPIV2.Components.Schemas.DnsRecordSRV;

export function isManagedARecord(
  r: DnsRecordCombinedA,
): r is DnsCombinedAManaged {
  return "managedBy" in r;
}

export function isCustomARecord(
  r: DnsRecordCombinedA,
): r is DnsCombinedACustom {
  return "a" in r || "aaaa" in r;
}

export function isManagedMXRecord(r: DnsRecordMX): r is DnsRecordMXManaged {
  return "managed" in r && r.managed;
}

export function isCustomMXRecord(r: DnsRecordMX): r is DnsRecordMXCustom {
  return "records" in r;
}

export function isTXTRecord(r: DnsRecordTXT): r is DnsRecordTXTComponent {
  return "entries" in r;
}

export function isSRVRecord(r: DnsRecordSRV): r is DnsRecordSRVComponent {
  return "records" in r;
}
