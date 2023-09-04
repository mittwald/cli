/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2DeliveryboxesId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["deliveryboxGetSpecific"]>
>;

export abstract class GeneratedMailDeliveryboxGetSpecific extends GetBaseCommand<
  typeof GeneratedMailDeliveryboxGetSpecific,
  APIResponse
> {
  static description = "Get a specific deliverybox";

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
    return await this.apiClient.mail.deliveryboxGetSpecific({
      ...(await this.mapParams(this.args as PathParams)),
    } as Parameters<typeof this.apiClient.mail.deliveryboxGetSpecific>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
