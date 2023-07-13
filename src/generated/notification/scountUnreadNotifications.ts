/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { GetBaseCommand } from "../../GetBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2NotificationsUnreadCounts.Get.Parameters.Path;
type APIResponse = Awaited<
  ReturnType<MittwaldAPIV2Client["notification"]["scountUnreadNotifications"]>
>;

export abstract class GeneratedNotificationsCountUnreadNotifications extends GetBaseCommand<
  typeof GeneratedNotificationsCountUnreadNotifications,
  APIResponse
> {
  static description = "Get the counts for unread notifications of the user.";

  static flags = {
    ...GetBaseCommand.baseFlags,
  };
  static args = {};

  protected async getData(): Promise<APIResponse> {
    return await this.apiClient.notification.scountUnreadNotifications({
      pathParameters: await this.mapParams(this.args as PathParams),
    } as Parameters<typeof this.apiClient.notification.scountUnreadNotifications>[0]);
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
