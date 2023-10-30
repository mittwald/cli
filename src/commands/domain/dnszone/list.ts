import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDnsZones.Get.Parameters.Path;
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
    const projectId = await withProjectId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );
    return await this.apiClient.domain.dnsListDnsZones({
      projectId,
    });
  }
}
