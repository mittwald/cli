import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../../lib/basecommands/GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DeliveryBoxesDeliveryBoxId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["getDeliveryBox"]>
>;

export default class Get extends GetBaseCommand<typeof Get, APIResponse> {
  static description = "Get a specific delivery box";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    id: Args.string({
      description: "ID of the deliverybox you want to retrieve",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return this.apiClient.mail.getDeliveryBox({
      deliveryBoxId: this.args.id,
    } as Parameters<typeof this.apiClient.mail.getDeliveryBox>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
