/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDomains.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["listDomains"]>
>;

export abstract class GeneratedDomainListDomains<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<typeof GeneratedDomainListDomains, TItem, Response> {
  static description = "List Domains belonging to a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "undefined",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.domain.listDomains({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.domain.listDomains>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
