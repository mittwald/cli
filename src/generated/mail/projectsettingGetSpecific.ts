/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdMailsettings.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["projectsettingGetSpecific"]>
>;

export abstract class GeneratedMailProjectsettingGetSpecific extends GetBaseCommand<
  typeof GeneratedMailProjectsettingGetSpecific,
  APIResponse
> {
  static description = "Get settings for a given project ID";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "ID of the project you want to retrieve settings for",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.mail.projectsettingGetSpecific({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.mail.projectsettingGetSpecific>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
