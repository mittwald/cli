import { Simplify } from "@mittwald/api-client-commons";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../../types.js";
import { ListBaseCommand } from "../../../ListBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDomainOwnerships.Get.Responses.$200.Content.ApplicationJson[number]
>;
type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDomainOwnerships.Get.Parameters.Path;
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
    const pathParameters: PathParams = {
      projectId: await withProjectId(
        this.apiClient,
        List,
        this.flags,
        this.args,
        this.config,
      ),
    };
    return await this.apiClient.domain.listDomainOwnerships({
      ...pathParameters,
    });
  }

  protected mapData(data: SuccessfulResponse<Response, 200>["data"]) {
    return data;
  }
}
