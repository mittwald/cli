/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2CustomerInvitesInviteId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["customer"]["getCustomerInvite"]>
>;

export abstract class GeneratedCustomerGetCustomerInvite extends GetBaseCommand<
  typeof GeneratedCustomerGetCustomerInvite,
  APIResponse
> {
  static description = "Get a CustomerInvite.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    inviteId: Args.string({
      description: "ID of the CustomerInvite to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.customer.getCustomerInvite({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.customer.getCustomerInvite>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
