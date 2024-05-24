import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { projectFlags } from "../../lib/resources/project/flags.js";
import { SuccessfulResponse } from "../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../rendering/ListFormatter.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2Domains.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["listDomains"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List domains belonging to a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return this.apiClient.domain.listDomains({
      queryParameters: { projectId },
    });
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      id: {
        header: "ID",
        get: (r) => r.domainId,
      },
      domain: {
        header: "Domain",
      },
      owner: {
        header: "Owner",
        get: (r) =>
          r.handles.ownerC.current.handleFields?.find((f) => f.name === "name")
            ?.value,
      },
      connected: {
        header: "Connected",
      },
      nameservers: {
        header: "Nameservers",
        extended: true,
        get: (r) => r.nameservers.join(", "),
      },
    };
  }
}
