/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectMembershipsMembershipId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getProjectMembership"]>
>;

export abstract class GeneratedProjectGetProjectMembership extends GetBaseCommand<
  typeof GeneratedProjectGetProjectMembership,
  APIResponse
> {
  static description = "Get a ProjectMembership";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    membershipId: Args.string({
      description: "ID of the ProjectMembership to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.project.getProjectMembership({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.project.getProjectMembership>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
