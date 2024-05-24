import { Simplify } from "@mittwald/api-client-commons";
import {
  appInstallationArgs,
  withAppInstallationId,
} from "../../lib/resources/app/flags.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import { getAppInstallationFromUuid } from "../../lib/resources/app/uuid.js";
import { sortArrayByExternalVersion } from "../../lib/resources/app/versions.js";

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2AppsAppIdVersions.Get.Responses.$200.Content.ApplicationJson[number]
>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listAppversions"]>
>;

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List upgrade candidates for an app installation.";
  static args = {
    ...appInstallationArgs,
  };
  static flags = {
    ...ListBaseCommand.baseFlags,
  };

  protected async getData(): Promise<Response> {
    const appInstallationId: string = await withAppInstallationId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );

    const currentAppInstallation: AppInstallation =
      await getAppInstallationFromUuid(this.apiClient, appInstallationId);

    if (currentAppInstallation.appVersion.current === undefined) {
      throw new Error("current app version could not be determined");
    }

    return await this.apiClient.app.listUpdateCandidatesForAppversion({
      appId: currentAppInstallation.appId,
      baseAppVersionId: currentAppInstallation.appVersion.current,
    });
  }

  protected async mapData(data: ResponseItem[]): Promise<ResponseItem[]> {
    return sortArrayByExternalVersion(data);
  }

  protected getColumns(): ListColumns<ResponseItem> {
    return {
      externalVersion: {
        header: "Version",
        get: (i) => {
          return i.externalVersion;
        },
      },
    };
  }
}
