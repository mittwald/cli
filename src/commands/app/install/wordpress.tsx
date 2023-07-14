import { Flags } from "@oclif/core";
import { getAppUuidFromAppName } from "../../../lib/app/appHelpers.js";
import {
  getAppVersionUuidFromAppVersion,
  getLatestAvailableAppVersionForApp,
} from "../../../lib/app/appVersionHelpers.js";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { projectFlags, withProjectId } from "../../../lib/project/flags.js";
import { ExecRenderBaseCommand } from "../../../rendering/react/ExecRenderBaseCommand.js";
import {
  makeProcessRenderer,
  processFlags,
} from "../../../rendering/react/process_flags.js";
import { Value } from "../../../rendering/react/components/Value.js";
import { Text } from "ink";
import { Success } from "../../../rendering/react/components/Success.js";
import { waitUntil } from "../../../lib/wait.js";
import React from "react";
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

export default class AppCreateWordpress extends ExecRenderBaseCommand<
  typeof AppCreateWordpress,
  { appInstallationId: string }
> {
  static description = "Creates new WordPress Installation.";

  static flags = {
    ...projectFlags,
    ...processFlags,
    version: Flags.string({
      required: true,
      description: "Version of the App to be created - Defaults to latest",
      default: "latest",
    }),
    host: Flags.string({
      required: true,
      description:
        "Host under which the App will be available (Needs to be created separately).",
    }),
    "admin-user": Flags.string({
      required: true,
      description: "First Admin User for the app.",
    }),
    "admin-email": Flags.string({
      required: true,
      description: "First Admin Users E-Mail.",
    }),
    "admin-pass": Flags.string({
      required: true,
      description: "First Admin Users Password.",
    }),
    "site-title": Flags.string({
      required: true,
      description: "Site Title of the created appInstallation.",
    }),
    wait: Flags.boolean({
      char: "w",
      description: "Wait for the App to be ready.",
    }),
  };

  protected async exec(): Promise<{ appInstallationId: string }> {
    const process = makeProcessRenderer(this.flags, "Installing WordPress");

    const { flags, args } = await this.parse(AppCreateWordpress);
    const app = "WordPress";
    const appUuid: string = await getAppUuidFromAppName(this.apiClient, app);
    const projectId = await withProjectId(
      this.apiClient,
      flags,
      args,
      this.config,
    );

    const appVersion = await process.runStep(
      "determining app version",
      async (): Promise<AppAppVersion> => {
        let v: AppAppVersion | undefined;

        if (flags.version && flags.version !== "latest") {
          v = await getAppVersionUuidFromAppVersion(
            this.apiClient,
            appUuid,
            flags.version,
          );
        } else {
          v = await getLatestAvailableAppVersionForApp(this.apiClient, appUuid);
        }

        if (!v) {
          throw new Error("App Version ${flags.version} not found.");
        }

        return v;
      },
    );

    process.addInfo(
      <Text>
        installing version: <Value>{appVersion.externalVersion}</Value>
      </Text>,
    );

    const [appInstallationId, eventId] = await process.runStep(
      "starting installation",
      async (): Promise<[string, string]> => {
        const result = await this.apiClient.app.requestAppinstallation({
          pathParameters: { projectId },
          data: {
            appVersionId: appVersion.id,
            description: flags["site-title"],
            updatePolicy: "none",
            userInputs: [
              { name: "host", value: flags.host },
              { name: "site_title", value: flags["site-title"] },
              { name: "admin_user", value: flags["admin-user"] },
              { name: "admin_email", value: flags["admin-email"] },
              { name: "admin_pass", value: flags["admin-pass"] },
            ],
          },
        });

        assertStatus(result, 201);
        return [result.data.id, result.headers["etag"]];
      },
    );

    if (flags.wait) {
      const stepWaiting = process.addStep(
        <Text>waiting for app installation to be ready</Text>,
      );

      await waitUntil(async () => {
        const installationResponse =
          await this.apiClient.app.getAppinstallation({
            pathParameters: { appInstallationId },
            // TODO: Remove once @mittwald/api-client supports this
            headers: { "if-event-reached": eventId } as any, // eslint-disable-line
          });

        if (
          installationResponse.status === 200 &&
          installationResponse.data.appVersion.current ==
            installationResponse.data.appVersion.desired
        ) {
          return true;
        }
      });

      stepWaiting.complete();
    }

    process.complete(
      <Success>
        Your WordPress installation is now complete. Have fun! 🎉
      </Success>,
    );

    return { appInstallationId };
  }

  protected render({
    appInstallationId,
  }: {
    appInstallationId: string;
  }): React.ReactNode {
    if (this.flags.quiet) {
      this.log(appInstallationId);
    }
    return undefined;
  }
}
