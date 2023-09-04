/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams = MittwaldAPIV2.Paths.V2Projects.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listProjects"]>
>;

export abstract class GeneratedProjectListProjects<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedProjectListProjects,
  TItem,
  Response
> {
  static description = "List Project's for an Organization or Server.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.project.listProjects({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.project.listProjects>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
