import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { projectFlags } from "../../../lib/resources/project/flags.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { Simplify } from "@mittwald/api-client-commons";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../../rendering/ListFormatter.js";
import {
  isCustomARecord,
  isCustomMXRecord,
  isManagedARecord,
  isManagedMXRecord,
  isSRVRecord,
  isTXTRecord,
} from "../../../lib/resources/domain/dnszone/records.js";

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
    return this.apiClient.domain.dnsListDnsZones({ projectId });
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
