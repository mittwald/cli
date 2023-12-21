import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/process/process_flags.js";
import { ReactNode } from "react";
import { Args, Flags } from "@oclif/core";
import { Success } from "../../../rendering/react/components/Success.js";
import {
  dnsZoneArgs,
  withDnsZoneId,
} from "../../../lib/domain/dnszone/flags.js";
import { projectFlags } from "../../../lib/project/flags.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import DnsRecordMXRecord = MittwaldAPIV2.Components.Schemas.DnsRecordMXRecord;
import DnsRecordSRVRecord = MittwaldAPIV2.Components.Schemas.DnsRecordSRVRecord;
import { ProcessRenderer } from "../../../rendering/process/process.js";

type UpdateResult = void;

export default class Update extends ExecRenderBaseCommand<
  typeof Update,
  UpdateResult
> {
  static description = "Updates a record set of a DNS zone";
  static args = {
    ...dnsZoneArgs,
    "record-set": Args.string({
      description: "The record type of the record set",
      options: ["a", "mx", "txt", "srv", "cname"],
      required: true,
    }),
  };
  static examples = [
    {
      description: "Set A and AAAA records",
      command:
        "<%= config.bin %> <%= command.id %> domain.example a --record 203.0.113.123 --record 2001:db8::1",
    },
    {
      description: "Set MX records",
      command:
        '<%= config.bin %> <%= command.id %> domain.example mx --record "10 mail1.domain.example" --record "20 mail2.domain.example"',
    },
  ];
  static flags = {
    ...processFlags,
    ...projectFlags,
    managed: Flags.boolean({
      description:
        "Reset this record set to fully-managed (only for A and MX records)",
      required: false,
      default: false,
    }),
    record: Flags.string({
      summary: "The records to set; may not be used with --managed",
      description: `The format depends on the record set type:

- for "a" records, this parameter should contain a IPv4 or IPv6 address (we will automatically create an A or AAAA record)
- for "mx" records, the parameter should be formatted as "<priority> <fqdn>", e.g. "10 mail.example.com"
- for "srv" records, the parameter should be formatted as "<priority> <weight> <port> <fqdn>", e.g. "10 1 5060 sip.example.com"
- for "txt" records, the parameter should be a string containing the TXT record value.`,
      multiple: true,
      required: false,
      default: undefined,
      exclusive: ["managed", "unset"],
    }),
    unset: Flags.boolean({
      summary: "Set this to remove all records from the record set",
      exclusive: ["managed", "record"],
    }),
    ttl: Flags.integer({
      description: "The TTL of the record set; omit to use the default TTL",
      required: false,
      default: undefined,
    }),
  };

  protected async exec(): Promise<UpdateResult> {
    const process = makeProcessRenderer(this.flags, "Updating DNS record set");
    const dnsZoneId = await withDnsZoneId(
      this.apiClient,
      Update,
      this.flags,
      this.args,
      this.config,
    );
    const recordSet = this.args["record-set"] as
      | "a"
      | "mx"
      | "txt"
      | "srv"
      | "cname";
    const { managed, unset, ttl, record = [] } = this.flags;

    const settings = {
      ttl: ttl ? { seconds: ttl } : { auto: true },
    };

    if (managed) {
      await this.resetRecordSetToManaged(process, recordSet, dnsZoneId);
      return;
    }

    if (unset) {
      await this.unsetRecordSet(process, dnsZoneId, recordSet);
      return;
    }

    if (recordSet === "a") {
      await process.runStep("updating record set", async () => {
        const r = await this.apiClient.domain.dnsUpdateRecordSet({
          dnsZoneId,
          recordSet,
          data: {
            aaaa: record.filter((r) => !looksLikeIPv4(r)),
            a: record.filter(looksLikeIPv4),
            settings,
          },
        });

        assertStatus(r, 204);
      });
    } else if (recordSet === "mx") {
      await process.runStep("updating record set", async () => {
        const r = await this.apiClient.domain.dnsUpdateRecordSet({
          dnsZoneId,
          recordSet,
          data: {
            records: record.map((r): DnsRecordMXRecord => {
              const [priority, fqdn] = r.split(" ");

              return {
                fqdn,
                priority: parseInt(priority, 10),
              };
            }) as [DnsRecordMXRecord],
            settings,
          },
        });

        assertStatus(r, 204);
      });
    } else if (recordSet === "srv") {
      await process.runStep("updating record set", async () => {
        const r = await this.apiClient.domain.dnsUpdateRecordSet({
          dnsZoneId,
          recordSet,
          data: {
            records: record.map((r): DnsRecordSRVRecord => {
              const [priority, weight, port, fqdn] = r.split(" ");

              return {
                fqdn,
                priority: parseInt(priority, 10),
                weight: parseInt(weight, 10),
                port: parseInt(port, 10),
              };
            }) as [DnsRecordSRVRecord],
            settings,
          },
        });

        assertStatus(r, 204);
      });
    } else if (recordSet === "txt") {
      await process.runStep("updating record set", async () => {
        const r = await this.apiClient.domain.dnsUpdateRecordSet({
          dnsZoneId,
          recordSet,
          data: {
            entries: record,
            settings,
          },
        });

        assertStatus(r, 204);
      });
    }

    process.complete(<Success>DNS record set successfully set.</Success>);

    return;
  }

  private async unsetRecordSet(
    process: ProcessRenderer,
    dnsZoneId: string,
    recordSet: "a" | "mx" | "txt" | "srv" | "cname",
  ) {
    await process.runStep("unsetting record set", async () => {
      const r = await this.apiClient.domain.dnsUpdateRecordSet({
        dnsZoneId,
        recordSet,
      });

      assertStatus(r, 204);
    });

    process.complete(<Success>DNS record set successfully unset.</Success>);

    return;
  }

  private async resetRecordSetToManaged(
    process: ProcessRenderer,
    recordSet: string,
    dnsZoneId: string,
  ) {
    await process.runStep("resetting record set", async () => {
      if (recordSet !== "a" && recordSet !== "mx") {
        throw new Error(
          "managed DNS records are only available for A and MX records",
        );
      }

      const r = await this.apiClient.domain.dnsSetRecordSetManaged({
        dnsZoneId,
        recordSet,
      });

      assertStatus(r, 204);
    });

    process.complete(
      <Success>DNS record set successfully reset to fully managed.</Success>,
    );
  }

  protected render(): ReactNode {
    return undefined;
  }
}

function looksLikeIPv4(r: string): boolean {
  return r.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) !== null;
}
