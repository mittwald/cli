import { FC, ReactNode } from "react";
import { useAppVersion } from "../../../../lib/resources/app/hooks.js";
import { Value } from "../Value.js";
import { AppInstallationStatus } from "./AppInstallationStatus.js";
import { SingleResult, SingleResultTable } from "../SingleResult.js";
import { AppSystemSoftware } from "./AppSystemSoftware.js";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Box, Text } from "ink";
import { useProject } from "../../../../lib/resources/project/hooks.js";
import { IDAndShortID } from "../IDAndShortID.js";
import path from "path";
import { isCustomAppInstallation } from "../../../../lib/resources/app/custom_installation.js";
import maybe from "../../../../lib/util/maybe.js";
import OptionalValue from "../OptionalValue.js";
import { AppVirtualHosts } from "./AppVirtualHosts.js";

type AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppApp = MittwaldAPIV2.Components.Schemas.AppApp;

export const AppInstallationDetails: FC<{
  appInstallation: AppAppInstallation;
  app: AppApp;
}> = ({ app, appInstallation }) => {
  const desiredAppVersion = useAppVersion(
    app.id,
    appInstallation.appVersion.desired,
  );
  const currentAppVersion = maybe(useAppVersion)(
    app.id,
    appInstallation.appVersion.current,
  );
  const project = maybe(useProject)(appInstallation.projectId);

  const absoluteInstallPath = project
    ? path.join(project.directories["Web"], appInstallation.installationPath)
    : null;

  const rows: Record<string, ReactNode> = {
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
    "Installation Path": <OptionalValue value={absoluteInstallPath} />,
    "Document root (in installation path)": (
      <Value>
        {desiredAppVersion.docRootUserEditable
          ? appInstallation.customDocumentRoot
          : desiredAppVersion.docRoot}
      </Value>
    ),
    Description: <Value>{appInstallation.description}</Value>,
    Status: isCustomAppInstallation(appInstallation.appId) ? (
      <Text>custom application</Text>
    ) : (
      <AppInstallationStatus
        appInstallation={appInstallation}
        desired={desiredAppVersion}
        current={currentAppVersion}
      />
    ),
  };

  const entrypoint = appInstallation.userInputs?.find(
    (i) => i.name === "entrypoint",
  )?.value;
  if (entrypoint) {
    rows["Entrypoint"] = <Value>{entrypoint}</Value>;
  }

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
    <AppVirtualHosts key="virtualhosts" appInstallation={appInstallation} />,
  ];

  return (
    <Box flexDirection="column" marginBottom={1}>
      {sections}
    </Box>
  );
};
