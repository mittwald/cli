/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SignupSshSshKeyId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["getSshKey"]>
>;

export abstract class GeneratedUserGetSshKey extends GetBaseCommand<
  typeof GeneratedUserGetSshKey,
  APIResponse
> {
  static description = "Get a specific stored SshKey";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    sshKeyId: Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.getSshKey({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.user.getSshKey>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
