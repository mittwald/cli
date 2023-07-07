/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { Args, Flags } from "@oclif/core";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2NewsletterSubscriptionsSelf.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["notification"]["newsletterGetInfo"]>
>;

export abstract class GeneratedNewsletterGetInfo extends GetBaseCommand<
  typeof GeneratedNewsletterGetInfo,
  APIResponse
> {
  static description = "Getting the subscription status of the subscription.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.notification.newsletterGetInfo({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.notification.newsletterGetInfo>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
