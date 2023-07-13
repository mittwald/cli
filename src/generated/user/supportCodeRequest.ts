/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2SignupSupportcode.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["user"]["supportCodeRequest"]>
>;

export abstract class GeneratedUserSupportCodeRequest extends GetBaseCommand<
  typeof GeneratedUserSupportCodeRequest,
  APIResponse
> {
  static description = "Request a support code";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.user.supportCodeRequest({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.user.supportCodeRequest>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
