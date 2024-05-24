import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../lib/apiutil/SuccessfulResponse.js";
import { ListBaseCommand } from "../../../lib/basecommands/ListBaseCommand.js";
import { Flags } from "@oclif/core";
import { ListColumns } from "../../../rendering/formatter/ListFormatter.js";
import { projectFlags } from "../../../lib/resources/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Ingresses.Get.Responses.$200.Content.ApplicationJson[number]
>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["ingressListIngresses"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List virtualhosts for a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
    all: Flags.boolean({
      char: "a",
      description:
        "List all virtual hosts that you have access to, regardless of project",
    }),
  };

  public async getData(): Promise<Response> {
    if (this.flags.all) {
      return await this.apiClient.domain.ingressListIngresses({});
    }

    const projectId = await this.withProjectId(List);

    return await this.apiClient.domain.ingressListIngresses({
      queryParameters: { projectId },
    });
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }

  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    const columns: ListColumns<ResponseItem> = {
      id: baseColumns.id,
      projectId: { header: "Project ID" },
      hostname: {},
      paths: {
        get: (r) =>
          r.paths
            .map((p) => {
              if ("directory" in p.target) {
                return `${p.path} → directory (${p.target.directory})`;
              }
              if ("url" in p.target) {
                return `${p.path} → url (${p.target.url})`;
              }
              if ("installationId" in p.target) {
                return `${p.path} → app (${p.target.installationId})`;
              }
              return `${p.path} → default`;
            })
            .join("\n"),
      },
      status: {
        header: "Status",
        get: (r) => {
          if (r.dnsValidationErrors.length === 0) {
            return "ready";
          }

          return `${r.dnsValidationErrors.length} issues`;
        },
      },
      ips: {
        header: "IP addresses",
        get: (r) => r.ips.v4.join(", "),
      },
    };

    if (!this.flags.all) {
      delete columns.projectId;
    }

    return columns;
  }
}
