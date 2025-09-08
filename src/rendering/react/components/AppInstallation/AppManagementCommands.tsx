import React, { FC } from "react";
import { Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { CommandHint } from "../Container/CommandHint.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

interface AppManagementCommandsProps {
  appInstallation: AppInstallation;
}

const infoColor = "blueBright";

/**
 * AppManagementCommands displays management commands for app installations
 * including SSH access, file operations, and maintenance tasks.
 */
export const AppManagementCommands: FC<AppManagementCommandsProps> = ({
  appInstallation,
}) => {
  return (
    <>
      <Text bold color={infoColor}>
        🔧 Manage your application:
      </Text>
      <CommandHint
        command={["mw", "app", "ssh", appInstallation.shortId]}
        description="Open SSH session to your app installation"
      />
      <CommandHint
        command={["mw", "app", "download", appInstallation.shortId]}
        description="Download app files to your local machine"
      />
      <CommandHint
        command={[
          "mw",
          "app",
          "upload",
          appInstallation.shortId,
          "<local-file>",
        ]}
        description="Upload files from your local machine to the app"
      />
      <CommandHint
        command={["mw", "app", "get", appInstallation.shortId]}
        description="Show detailed information about your app installation"
      />
    </>
  );
};
