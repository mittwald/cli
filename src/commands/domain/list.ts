import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";
import { projectFlags } from "../../lib/project/flags.js";
import { SuccessfulResponse } from "../../types.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDomains.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["listDomains"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List Domains belonging to a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.domain.listDomains({ projectId });
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): ResponseItem[] | Promise<ResponseItem[]> {
    return data;
  }
}
