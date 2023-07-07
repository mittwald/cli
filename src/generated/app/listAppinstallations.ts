/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Args, Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdAppinstallations.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listAppinstallations"]>
>;

export abstract class GeneratedAppListAppinstallations<
  TItem extends Record<string, unknown>
> extends ListBaseCommand<
  typeof GeneratedAppListAppinstallations,
  TItem,
  Response
> {
  static description = "get all `AppInstallations` inside a specific `Project`";

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
    return await this.apiClient.app.listAppinstallations({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.app.listAppinstallations>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
