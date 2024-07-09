import { assertStatus, Simplify } from "@mittwald/api-client-commons";
import {
  projectFlags,
  withProjectId,
} from "../../lib/resources/project/flags.js";
import { ListBaseCommand } from "../../lib/basecommands/ListBaseCommand.js";
import { MittwaldAPIV2, MittwaldAPIV2Client } from "@mittwald/api-client";
import { SuccessfulResponse } from "../../lib/apiutil/SuccessfulResponse.js";
import { ListColumns } from "../../rendering/formatter/ListFormatter.js";
import {
  getAppFromUuid,
  getAppVersionFromUuid,
} from "../../lib/resources/app/uuid.js";
import { isCustomAppInstallation } from "../../lib/resources/app/custom_installation.js";

type AppApp = MittwaldAPIV2.Components.Schemas.AppApp;
type AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

type ResponseItem = Simplify<
  MittwaldAPIV2.Paths.V2ProjectsProjectIdAppInstallations.Get.Responses.$200.Content.ApplicationJson[number]
>;

type Response = Awaited<
  ReturnType<MittwaldAPIV2Client["app"]["listAppinstallations"]>
>;

type ExtendedResponseItem = ResponseItem & {
  app: AppApp;
  appVersionCurrent: AppAppVersion | undefined;
  appVersionDesired: AppAppVersion;
};

export default class List extends ListBaseCommand<
  typeof List,
  ResponseItem,
  Response
> {
  static description = "List installed apps in a project.";
  static flags = {
    ...ListBaseCommand.baseFlags,
    ...projectFlags,
  };

  protected async getData(): Promise<Response> {
    const projectId = await withProjectId(
      this.apiClient,
      List,
      this.flags,
      this.args,
      this.config,
    );
    const apps = await this.apiClient.app.listAppinstallations({
      projectId,
    });
    assertStatus(apps, 200);

    return apps;
  }

  protected mapData(
    data: SuccessfulResponse<Response, 200>["data"],
  ): Promise<ExtendedResponseItem[]> {
    return Promise.all(
      data.map(async (item) => {
        return {
          ...item,
          app: await getAppFromUuid(this.apiClient, item.appId),
          appVersionCurrent: item.appVersion.current
            ? await getAppVersionFromUuid(
                this.apiClient,
                item.appId,
                item.appVersion.current,
              )
            : undefined,
          appVersionDesired: await getAppVersionFromUuid(
            this.apiClient,
            item.appId,
            item.appVersion.desired,
          ),
        };
      }),
    );
  }

  protected getColumns(data: ExtendedResponseItem[]) {
    return this.getColumnsExtended(data) as ListColumns<ResponseItem>;
  }

  protected getColumnsExtended(
    rows: ExtendedResponseItem[],
  ): ListColumns<ExtendedResponseItem> {
    const { id, shortId } = super.getColumns(rows);
    return {
      id,
      shortId,
      description: {},
      app: {
        header: "Application",
        minWidth: 8,
        get: (i) => i.app.name,
      },
      appVersion: {
        header: "Version",
        get: (i) => {
          if (isCustomAppInstallation(i.appId)) {
            return "n/a";
          }

          if (i.appVersionCurrent?.id === i.appVersionDesired.id) {
            return i.appVersionDesired.externalVersion;
          }

          if (!i.appVersionCurrent) {
            return i.appVersionDesired.externalVersion;
          }

          return `${i.appVersionCurrent.externalVersion} => ${i.appVersionDesired.externalVersion}`;
        },
      },
      status: {
        header: "Status",
        get: (i) => {
          if (i.appVersionCurrent?.id === i.appVersionDesired.id) {
            return "up-to-date";
          }

          if (!i.appVersionCurrent) {
            return "installing";
          }

          return "updating";
        },
      },
      installationPath: {
        header: "Installed in",
      },
    };
  }
}
