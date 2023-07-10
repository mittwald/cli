/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { Flags } from "@oclif/core";
import { ListColumns } from "../../../Formatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Ingresses.Get.Responses.$200.Content.ApplicationJson[number]
>;

export type PathParams = MittwaldAPIV2.Paths.V2Ingresses.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["ingressListAccessible"]>
>;

export class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List Ingresses the user has access to.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "Project ID to filter by; if omitted this will list virtual hosts in all projects you have access to.",
      required: false,
    })
  };

  public async getData(): Promise<Response> {
    if (this.flags["project-id"]) {
      return await this.apiClient.domain.ingressListForProject({pathParameters: {projectId: this.flags["project-id"]}});
    }

    return await this.apiClient.domain.ingressListAccessible({});
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }


  protected getColumns(data: ResponseItem[]): ListColumns<ResponseItem> {
    const baseColumns = super.getColumns(data);
    return {
      id: baseColumns.id,
      projectId: {header: "Project ID"},
      hostname: {},
      paths: {
        get: r => r.paths.map(p => {
          if ("directory" in p.target) {
            return `${p.path} -> directory (${p.target.directory})`;
          }
          if ("url" in p.target) {
            return `${p.path} -> url (${p.target.url})`;
          }
          return `${p.path} -> app (${p.target.installationId})`;
        }).join("\n")
      },
      ips: {
        header: "IP addresses",
        get: r => r.ips.v4.join(", ")
      }
    }
  };

}