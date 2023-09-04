/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectInvites.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listProjectInvites"]>
>;

export abstract class GeneratedProjectListProjectInvites<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedProjectListProjectInvites,
  TItem,
  Response
> {
  static description = "List all ProjectInvites for the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.project.listProjectInvites({
      ...(await this.mapParams(pathParams)),
    } as Parameters<typeof this.apiClient.project.listProjectInvites>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
