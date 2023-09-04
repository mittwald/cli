/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ServersServerId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getServer"]>
>;

export abstract class GeneratedProjectGetServer extends GetBaseCommand<
  typeof GeneratedProjectGetServer,
  APIResponse
> {
  static description = "Get a Server.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    serverId: Args.string({
      description: "ID of the Server to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.project.getServer({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.project.getServer>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
