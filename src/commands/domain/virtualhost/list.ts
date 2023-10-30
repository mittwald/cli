import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { Flags } from "@oclif/core";
import { ListColumns } from "../../../Formatter.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Ingresses.Get.Responses.$200.Content.ApplicationJson[number]
>;

export type PathParams = MittwaldAPIV2.Paths.V2Ingresses.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["ingressListAccessible"]>
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
      return await this.apiClient.domain.ingressListAccessible({});
    }

    const projectId = await withProjectId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );

    return await this.apiClient.domain.ingressListForProject({
      projectId,
    });
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
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
