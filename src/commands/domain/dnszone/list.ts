import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { projectFlags } from "../../../lib/project/flags.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["dnsListDnsZones"]>
>;

export default class List extends GetBaseCommand<typeof List, APIResponse> {
  static description = "gets all dns zones by project id";

  static flags = {
    ...GetBaseCommand.baseFlags,
    ...projectFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    const projectId = await this.withProjectId(List);
    return await this.apiClient.domain.dnsListDnsZones({
      projectId,
    });
  }
}
