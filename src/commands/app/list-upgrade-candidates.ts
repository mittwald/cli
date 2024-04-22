import { Simplify } from "@mittwald/api-client-commons";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/app/flags.js";
import { ListBaseCommand } from "../../ListBaseCommand.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../types.js";
import { ListColumns } from "../../Formatter.js";
import { getAllUpgradeCandidatesFromAppInstallationId } from "../../lib/app/versions.js";

type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2AppsAppIdVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listAppversions"]>
>;

type ExtendedResponseItem = ResponseItem & {
  appVersion: AppAppVersion;
};

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List update candidates for an appInstallation.";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  protected async getData(): Promise<AppAppVersion[]> {
    const appInstallationId = await withAppInstallationId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );

    return getAllUpgradeCandidatesFromAppInstallationId(
      this.apiClient,
      appInstallationId,
    );
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): Promise<ExtendedResponseItem[]> {
    return Promise.all(
      data.map(async (item) => {
        return {
          ...item,
        };
      }),
    );
  }

  protected getColumns(
    rows: ResponseItem[],
  ): ListColumns<ExtendedResponseItem> {
    const { id, shortId } = super.getColumns(rows);
    return {
      id,
      shortId,
      externalVersion: {
        header: "Version",
        get: (i) => {
          return i.appVersion.externalVersion;
        },
      },
    };
  }
}
