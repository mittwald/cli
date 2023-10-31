import { Args } from "@oclif/core";
import { MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["getDomain"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a domain.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    "domain-id": Args.string({
      description: "undefined",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.getDomain({
      domainId: this.args["domain-id"],
    });
  }
}
