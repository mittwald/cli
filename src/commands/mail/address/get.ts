import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2MailAddressesMailAddressId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["getMailAddress"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a specific mail address";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "id of the address you want to get",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return this.apiClient.mail.getMailAddress({
      mailAddressId: this.args.id,
    } as Parameters<typeof this.apiClient.mail.getMailAddress>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
