/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2UsersUserIdSettings.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getPersonalizedSettings"]>
>;

export abstract class GeneratedUserGetPersonalizedSettings extends GetBaseCommand<
  typeof GeneratedUserGetPersonalizedSettings,
  APIResponse
> {
  static description = "Get personalized settings.";

  static flags = {
    ...GetBaseCommand.baseFlags,
    "user-id": Flags.string({
      description: "`self` or the id of a user.",
      required: true,
    }),
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getPersonalizedSettings({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.user.getPersonalizedSettings>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
