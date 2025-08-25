import { RenderBaseCommand } from "../../lib/basecommands/RenderBaseCommand.js";
import React from "react";
import { Args } from "@oclif/core";
import { assertStatus, type MittwaldAPIV2 } from "@mittwald/api-client";
import { usePromise } from "@mittwald/react-use-promise";
import { Box, Text } from "ink";
import {
  SingleResult,
  SingleResultTable,
} from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";

type App = MittwaldAPIV2.Components.Schemas.AppApp;
type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;
type UserInput = MittwaldAPIV2.Components.Schemas.AppUserInput;

export class VersionInfo extends RenderBaseCommand<typeof VersionInfo> {
  static description = "show information about specific app versions";
  static summary =
    "This command shows information about a specific app version. It is useful to get information about the user inputs that are required for the version to be deployed successfully.";
  static args = {
    app: Args.string({
      description: "name of the app",
      required: true,
    }),
    version: Args.string({
      description: "version of the app",
      required: true,
    }),
  };

  protected render(): React.ReactNode {
    const { app, version } = this.args;

    const appData = usePromise(this.getApp.bind(this), [app]);
    const appVersionData = usePromise(this.getAppVersion.bind(this), [
      appData,
      version,
    ]);

    const sections = [
      <AppVersionDetails
        app={appData}
        appVersion={appVersionData}
        key="details"
      />,
    ];

    if (appVersionData.userInputs) {
      sections.push(
        <UserInputTable appVersion={appVersionData} key="inputs" />,
      );
    }

    return (
      <Box flexDirection="column" marginBottom={1}>
        {sections}
      </Box>
    );
  }

  private async getAppVersion(
    app: App,
    versionName: string,
  ): Promise<AppVersion> {
    const appVersions = await this.apiClient.app.listAppversions({
      appId: app.id,
    });
    assertStatus(appVersions, 200);

    const version = appVersions.data.find(
      (v) => v.externalVersion === versionName,
    );

    if (!version) {
      throw new Error(`version ${this.args.version} not found`);
    }

    return version;
  }

  private async getApp(appName: string): Promise<App> {
    const appResult = await this.apiClient.app.listApps();
    assertStatus(appResult, 200);

    const app = appResult.data.find(
      (a) => a.name.toLowerCase() === appName.toLowerCase(),
    );

    if (!app) {
      throw new Error(`app ${appName} not found`);
    }

    return app;
  }
}

function UserInputValue({ input }: { input: UserInput }) {
  return (
    <Text>
      type=<Value>{input.dataType}</Value>
      {input.defaultValue && (
        <>
          {" "}
          default=<Value>{input.defaultValue}</Value>
        </>
      )}
    </Text>
  );
}

function UserInputTable({ appVersion }: { appVersion: AppVersion }) {
  return (
    <SingleResult
      title={"USER INPUTS"}
      key="inputs"
      rows={Object.fromEntries(
        (appVersion.userInputs ?? []).map((u) => [
          u.name,
          <UserInputValue input={u} />,
        ]),
      )}
    />
  );
}

function AppVersionDetails({
  app,
  appVersion,
}: {
  app: App;
  appVersion: AppVersion;
}) {
  return (
    <SingleResult
      title="APP VERSION DETAILS"
      key="details"
      rows={{
        App: (
          <SingleResultTable
            rows={{
              UID: <Value>{app.id}</Value>,
              Name: <Value>{app.name}</Value>,
            }}
          />
        ),
        Version: (
          <SingleResultTable
            rows={{
              UID: <Value>{appVersion.id}</Value>,
              Version: <Value>{appVersion.externalVersion}</Value>,
            }}
          />
        ),
      }}
    />
  );
}
