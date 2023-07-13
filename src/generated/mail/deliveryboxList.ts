/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { Flags } from "@oclif/core";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2ProjectsProjectIdDeliveryboxes.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["mail"]["deliveryboxList"]>
>;

export abstract class GeneratedMailDeliveryboxList<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedMailDeliveryboxList,
  TItem,
  Response
> {
  static description = "Get all deliveryboxes by project ID";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
    "project-id": Flags.string({
      description: "Project ID the deliveryboxes are related to",
      required: true,
    }),
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {
      projectId: this.flags["project-id"],
    };
    return await this.apiClient.mail.deliveryboxList({
      pathParameters: await this.mapParams(pathParams),
    } as Parameters<typeof this.apiClient.mail.deliveryboxList>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
