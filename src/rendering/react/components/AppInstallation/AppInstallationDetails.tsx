import { FC } from "react";
import { useAppVersion } from "../../../../lib/app/hooks.js";
import { Value } from "../Value.js";
import { AppInstallationStatus } from "./AppInstallationStatus.js";
import { SingleResult } from "../SingleResult.js";
import { AppSystemSoftware } from "./AppSystemSoftware.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Box } from "ink";
import AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
import AppApp = MittwaldAPIV2.Components.Schemas.AppApp;

export const AppInstallationDetails: FC<{
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
