import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DomainOwnershipsDomainOwnershipId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["getDomainOwnership"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a domain ownership.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    domainOwnershipId: Args.string({
      description: "The domain ownership ID.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.getDomainOwnership({
      domainOwnershipId: this.args.domainOwnershipId,
    } as Parameters<typeof this.apiClient.domain.getDomainOwnership>[0]);
  }
}
