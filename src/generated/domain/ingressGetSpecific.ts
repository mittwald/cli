/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2IngressesIngressId.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["domain"]["ingressGetSpecific"]>
>;

export abstract class GeneratedIngressGetSpecific extends GetBaseCommand<
  typeof GeneratedIngressGetSpecific,
  APIResponse
> {
  static description = "Get an Ingress.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {
    ingressId: Args.string({
      description: "ID of the Ingress to be retrieved.",
      required: true,
    }),
  };

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.domain.ingressGetSpecific({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.domain.ingressGetSpecific>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
