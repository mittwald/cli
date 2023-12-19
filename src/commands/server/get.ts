import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { serverArgs } from "../../lib/server/flags.js";

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
    const serverId = await this.withServerId(Get);
    return await this.apiClient.project.getServer({ serverId });
  }
}
