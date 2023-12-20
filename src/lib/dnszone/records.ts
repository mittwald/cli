import { MittwaldAPIV2 } from "@mittwald/api-client";
import DnsRecordCombinedA = MittwaldAPIV2.Components.Schemas.DnsRecordCombinedA;
import DnsCombinedAManaged = MittwaldAPIV2.Components.Schemas.DnsCombinedAManaged;
import DnsRecordMX = MittwaldAPIV2.Components.Schemas.DnsRecordMX;
import DnsRecordMXManaged = MittwaldAPIV2.Components.Schemas.DnsRecordMXManaged;
import DnsCombinedACustom = MittwaldAPIV2.Components.Schemas.DnsCombinedACustom;
import DnsRecordMXCustom = MittwaldAPIV2.Components.Schemas.DnsRecordMXCustom;
import DnsRecordTXT = MittwaldAPIV2.Components.Schemas.DnsRecordTXT;
import DnsRecordTXTComponent = MittwaldAPIV2.Components.Schemas.DnsRecordTXTComponent;
import DnsRecordSRVComponent = MittwaldAPIV2.Components.Schemas.DnsRecordSRVComponent;
import DnsRecordSRV = MittwaldAPIV2.Components.Schemas.DnsRecordSRV;

export function isManagedARecord(
  r: DnsRecordCombinedA,
): r is DnsCombinedAManaged {
  return "managedBy" in r;
}

export function isCustomARecord(
  r: DnsRecordCombinedA,
): r is DnsCombinedACustom {
  return "custom" in r;
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
