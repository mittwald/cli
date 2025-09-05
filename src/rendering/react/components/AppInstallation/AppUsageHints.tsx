import React, { FC } from "react";
import { Box, Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import useDefaultBoxStyles from "../../styles/useDefaultBoxStyles.js";
import { AppDomainConnectionHints } from "./AppDomainConnectionHints.js";
import { AppBackendAccessHints } from "./AppBackendAccessHints.js";
import { AppManagementCommands } from "./AppManagementCommands.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
type AppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

interface AppUsageHintsProps {
  appInstallation: AppInstallation;
  appVersion: AppVersion;
  appName: string;
  appHost?: string;
}

const infoColor = "blueBright";

/**
 * AppUsageHints displays comprehensive usage instructions for app
 * installations, including domain connection setup and backend access
 * information.
 */
const AppUsageHints: FC<AppUsageHintsProps> = ({
  appInstallation,
  appVersion,
  appName,
  appHost,
}) => {
  const defaultBoxStyles = useDefaultBoxStyles();

  const boxProps = {
    ...defaultBoxStyles,
    borderColor: infoColor,
    marginLeft: 2,
  };

  return (
    <Box {...boxProps} flexDirection="column">
      <Text bold underline color={infoColor}>
        USAGE HINTS
      </Text>

      <Box marginTop={1}>
        <Text>Connect to your application using these methods:</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <AppDomainConnectionHints appInstallation={appInstallation} />

        {appVersion.backendPathTemplate && (
          <AppBackendAccessHints
            appInstallation={appInstallation}
            backendPathTemplate={appVersion.backendPathTemplate}
            appName={appName}
            appHost={appHost}
          />
        )}

        <AppManagementCommands appInstallation={appInstallation} />

        <Box marginTop={1}>
          <Text color={infoColor}>
            💡 Tip: Use <Value>mw app list</Value> to see all your app
            installations and their current status.
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default AppUsageHints;
