import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { serverArgs, withServerId } from "../../lib/server/flags.js";

type PathParams = MittwaldAPIV2.Paths.V2ServersServerId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["project"]["getServer"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a server.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    ...serverArgs,
  };

  protected async getData(): Promise<APIResponse> {
    const serverId = await withServerId(
      this.apiClient,
      Get,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.project.getServer({ serverId });
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
