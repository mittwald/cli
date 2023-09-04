/* eslint-disable */
/* prettier-ignore */
/* This file is auto-generated with acg (@mittwald/api-code-generator) */
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListBaseCommand } from "../../ListBaseCommand.js";

export type PathParams =
  MittwaldAPIV2.Paths.V2Notifications.Get.Parameters.Path;
export type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["notification"]["slistNotifications"]>
>;

export abstract class GeneratedNotificationsListNotifications<
  TItem extends Record<string, unknown>,
> extends ListBaseCommand<
  typeof GeneratedNotificationsListNotifications,
  TItem,
  Response
> {
  static description = "List all unread notifications";

  static args = {};
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  public async getData(): Promise<Response> {
    const pathParams: PathParams = {};
    return await this.apiClient.notification.slistNotifications(
      (await this.mapParams(pathParams)) as Parameters<
        typeof this.apiClient.notification.slistNotifications
      >[0],
    );
  }

  protected mapParams(input: PathParams): Promise<PathParams> | PathParams {
    return input;
  }
}
