/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectMemberships.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["listProjectMemberships"]>
>;

export abstract class GeneratedProjectListProjectMemberships<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedProjectListProjectMemberships,
  TItem,
  Response
> {
  static description =
    "List ProjectMemberships belonging to the executing user.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.project.listProjectMemberships({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.project.listProjectMemberships>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
