import { RenderBaseCommand } from "../../rendering/react/RenderBaseCommand.js";
import { Args } from "@oclif/core";
import { FC, ReactNode } from "react";
import { useRenderContext } from "../../rendering/react/context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { RenderJson } from "../../rendering/react/json/RenderJson.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { SingleResult } from "../../rendering/react/components/SingleResult.js";
import { Value } from "../../rendering/react/components/Value.js";
import { GetBaseCommand } from "../../GetBaseCommand.js";
import { Box, Text } from "ink";
import { Header } from "../../rendering/react/components/Header.js";
import {
  useAppVersion,
  useSystemSoftware,
  useSystemSoftwareVersion,
} from "../../lib/app/hooks.js";
import AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
import AppApp = MittwaldAPIV2.Components.Schemas.AppApp;
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

const AppSystemSoftware: FC<{ appInstallation: AppAppInstallation }> = ({
  appInstallation,
}) => {
  if (!appInstallation.systemSoftware) {
    return (
      <>
        <Header title={"System software"} />
        <Text>No system software defined</Text>
      </>
    );
  }

  const rows: Record<string, ReactNode> = {};

  for (const systemSoftwareDef of appInstallation.systemSoftware || []) {
    const systemSoftware = useSystemSoftware(
      systemSoftwareDef.systemSoftwareId,
    );

    const systemSoftwareVersion = useSystemSoftwareVersion(
      systemSoftware.id,
      systemSoftwareDef.systemSoftwareVersion.desired,
    );

    rows[systemSoftware.name] = (
      <Text>
        <Value>{systemSoftwareVersion.externalVersion}</Value> (update policy:{" "}
        <Value>{systemSoftwareDef.updatePolicy}</Value>)
      </Text>
    );
  }

  return <SingleResult title={"System software"} rows={rows} />;
};

const AppInstallationStatus: FC<{
  appInstallation: AppAppInstallation;
  desired: AppAppVersion;
  current: AppAppVersion | undefined;
}> = ({ desired, current }) => {
  if (!current) {
    return (
      <Text>
        installing version <Value>{desired.externalVersion}</Value>
      </Text>
    );
  }

  if (current.id === desired.id) {
    return (
      <Text>
        up-to-date at version <Value>{current.externalVersion}</Value>
      </Text>
    );
  }

  return (
    <Text>
      upgrading from version <Value>{current.externalVersion}</Value>, desired
      version is <Value>{desired.externalVersion}</Value>
    </Text>
  );
};

const GetAppInstallation: FC<{
  appInstallation: AppAppInstallation;
  app: AppApp;
}> = ({ app, appInstallation }) => {
  const desiredAppVersion = useAppVersion(
    app.id,
    appInstallation.appVersion.desired,
  );
  const currentAppVersion = appInstallation.appVersion.current
    ? useAppVersion(app.id, appInstallation.appVersion.current)
    : undefined;

  const rows = {
    "App ID": <Value>{appInstallation.appId}</Value>,
    "Installation Path": <Value>{appInstallation.installationPath}</Value>,
    Description: <Value>{appInstallation.description}</Value>,
    Status: (
      <AppInstallationStatus
        appInstallation={appInstallation}
        desired={desiredAppVersion}
        current={currentAppVersion}
      />
    ),
  };
  const title = (
    <>
      APP INSTALLATION: <Value>{app.name}</Value> in{" "}
      <Value>{appInstallation.installationPath}</Value>
    </>
  );

  const sections = [
    <SingleResult key="primary" title={title} rows={rows} />,
    <AppSystemSoftware
      key="systemsoftware"
      appInstallation={appInstallation}
    />,
  ];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};

export default class Get extends RenderBaseCommand<typeof Get> {
  static description = "Get details about an app installation";
  static flags = { ...GetBaseCommand.baseFlags };
  static args = {
    "installation-id": Args.string({
      description: "ID of the app installation to get",
      required: true,
    }),
  };

  protected render(): ReactNode {
    const { apiClient } = useRenderContext();
    const appInstallationResponse = usePromise(
      (id) =>
        apiClient.app.getAppinstallation({
          pathParameters: { appInstallationId: id },
        }),
      [this.args["installation-id"]],
    );

    assertStatus(appInstallationResponse, 200);

    const appResponse = usePromise(
      (appId) => apiClient.app.getApp({ pathParameters: { appId } }),
      [appInstallationResponse.data.appId],
    );
    assertStatus(appResponse, 200);

    if (this.flags.output === "json") {
      return (
        <RenderJson
          name="appInstallation"
          data={appInstallationResponse.data}
        />
      );
    }

    return (
      <GetAppInstallation
        appInstallation={appInstallationResponse.data}
        app={appResponse.data}
      />
    );
  }
}
