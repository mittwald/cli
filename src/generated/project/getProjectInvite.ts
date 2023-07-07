/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectInvitesInviteId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getProjectInvite"]>
>;

export abstract class GeneratedProjectGetProjectInvite extends GetBaseCommand<
  typeof GeneratedProjectGetProjectInvite,
  APIResponse
> {
  static description = "Get a ProjectInvite.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    inviteId: Args.string({
      description: "ID of the ProjectInvite to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.project.getProjectInvite({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.project.getProjectInvite>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
