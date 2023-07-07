/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdCronjobs.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["cronjob"]["listCronjobs"]>
>;

export abstract class GeneratedCronjobListCronjobs<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedCronjobListCronjobs,
  TItem,
  Response
> {
  static description = "List Cronjobs belonging to a Project.";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the Project for which to list Cronjobs for.",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.cronjob.listCronjobs({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.cronjob.listCronjobs>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
