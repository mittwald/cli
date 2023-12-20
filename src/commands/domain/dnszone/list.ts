import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { projectFlags } from "../../../lib/project/flags.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { Simplify } from "@mittwald/api-client-commons";
import { SuccessfulResponse } from "../../../types.js";
import { ListColumns } from "../../../Formatter.js";
import DnsCombinedACustom = MittwaldAPIV2.Components.Schemas.DnsCombinedACustom;
import DnsRecordCombinedA = MittwaldAPIV2.Components.Schemas.DnsRecordCombinedA;
import DnsCombinedAManaged = MittwaldAPIV2.Components.Schemas.DnsCombinedAManaged;
import DnsRecordMX = MittwaldAPIV2.Components.Schemas.DnsRecordMX;
import DnsRecordMXManaged = MittwaldAPIV2.Components.Schemas.DnsRecordMXManaged;
import DnsRecordMXCustom = MittwaldAPIV2.Components.Schemas.DnsRecordMXCustom;
import DnsRecordTXT = MittwaldAPIV2.Components.Schemas.DnsRecordTXT;
import DnsRecordTXTComponent = MittwaldAPIV2.Components.Schemas.DnsRecordTXTComponent;
import DnsRecordSRV = MittwaldAPIV2.Components.Schemas.DnsRecordSRV;
import DnsRecordSRVComponent = MittwaldAPIV2.Components.Schemas.DnsRecordSRVComponent;
import {
  isCustomARecord,
  isCustomMXRecord,
  isManagedARecord,
  isManagedMXRecord,
  isSRVRecord,
  isTXTRecord,
} from "../../../lib/dnszone/records.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDnsZones.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["dnsListDnsZones"]>
>;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "list all DNS zones by project ID";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.domain.dnsListDnsZones({ projectId });
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const { id } = super.getColumns(data);
    return {
      id,
      domain: {
        header: "Domain",
      },
      a: {
        header: "A",
        get: (r) => {
          if (isManagedARecord(r.recordSet.combinedARecords)) {
            return "managed";
          }
          if (isCustomARecord(r.recordSet.combinedARecords)) {
            return (
              r.recordSet.combinedARecords.a.length +
              r.recordSet.combinedARecords.aaaa.length +
              " records"
            );
          }
          return "no records";
        },
      },
      mx: {
        header: "MX",
        get: (r) => {
          if (isManagedMXRecord(r.recordSet.mx)) {
            return "managed";
          }
          if (isCustomMXRecord(r.recordSet.mx)) {
            return r.recordSet.mx.records.length + " records";
          }
          return "no records";
        },
      },
      srv: {
        header: "SRV",
        get: (r) => {
          if (isSRVRecord(r.recordSet.srv)) {
            return r.recordSet.srv.records.length + " records";
          }
          return "no records";
        },
      },
      txt: {
        header: "TXT",
        get: (r) => {
          if (isTXTRecord(r.recordSet.txt)) {
            return r.recordSet.txt.entries.length + " records";
          }
          return "no records";
        },
      },
    };
  }
}
