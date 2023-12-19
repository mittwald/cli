import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags } from "../../../lib/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDomainOwnerships.Get.Responses.$200.Content.ApplicationJson[number]
>;
type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["listDomainOwnerships"]>
>;

export class List extends ListBaseCommand<typeof List, ResponseItem, Response> {
  static description = "List all domain ownerships of a project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  public async getData(): Promise<Response> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.domain.listDomainOwnerships({ projectId });
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
