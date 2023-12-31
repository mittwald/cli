import { FC } from "react";
import { useAppVersion } from "../../../../lib/app/hooks.js";
import { Value } from "../Value.js";
import { AppInstallationStatus } from "./AppInstallationStatus.js";
import { SingleResult, SingleResultTable } from "../SingleResult.js";
import { AppSystemSoftware } from "./AppSystemSoftware.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Box, Text } from "ink";
import AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
import AppApp = MittwaldAPIV2.Components.Schemas.AppApp;
import { phpInstaller } from "../../../../commands/app/create/php.js";
import { nodeInstaller } from "../../../../commands/app/create/node.js";
import { useProject } from "../../../../lib/project/hooks.js";
import { IDAndShortID } from "../IDAndShortID.js";
import path from "path";

export const AppInstallationDetails: FC<{
  appInstallation: AppAppInstallation;
  app: AppApp;
}> = ({ app, appInstallation }) => {
  const customInstallation = [phpInstaller.appId, nodeInstaller.appId].includes(
    app.id,
  );
  const desiredAppVersion = useAppVersion(
    app.id,
    appInstallation.appVersion.desired,
  );
  const currentAppVersion = appInstallation.appVersion.current
    ? useAppVersion(app.id, appInstallation.appVersion.current)
    : undefined;
  const project = appInstallation.projectId
    ? useProject(appInstallation.projectId)
    : null;

  const absoluteInstallPath = project
    ? path.join(project.directories["Web"], appInstallation.installationPath)
    : null;

  const rows = {
    "Installation ID": <Value>{appInstallation.id}</Value>,
    App: (
      <SingleResultTable
        rows={{
          ID: <Value>{app.id}</Value>,
          Name: <Value>{app.name}</Value>,
        }}
      />
    ),
    Project: project ? (
      <SingleResultTable
        rows={{
          ID: <IDAndShortID object={project} />,
          Description: <Value>{project.description}</Value>,
        }}
      />
    ) : (
      <Value notSet />
    ),
    "Installation Path": absoluteInstallPath ? (
      <Value>{absoluteInstallPath}</Value>
    ) : (
      <Value notSet />
    ),
    "Document root (in installation path)": (
      <Value>{appInstallation.customDocumentRoot ?? "/"}</Value>
    ),
    Description: <Value>{appInstallation.description}</Value>,
    Status: customInstallation ? (
      <Text>custom application</Text>
    ) : (
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
    <SingleResult
      key="access"
      title="Access"
      rows={{
        "SSH/SFTP Host": (
          <Text>
            <Value>
              ssh.{project?.clusterID}.{project?.clusterDomain}
            </Value>{" "}
            <Text color="gray">
              (Use the "app ssh" command to connect directly using the CLI)
            </Text>
          </Text>
        ),
      }}
    />,
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
