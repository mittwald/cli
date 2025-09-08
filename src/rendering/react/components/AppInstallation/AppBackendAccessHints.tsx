import React, { FC } from "react";
import { Box, Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

interface AppBackendAccessHintsProps {
  appInstallation: AppInstallation;
  backendPathTemplate: string;
  appName: string;
  appHost?: string;
}

const infoColor = "blueBright";

/**
 * AppBackendAccessHints displays backend/admin access information when a
 * backendPathTemplate is available in the app version.
 */
export const AppBackendAccessHints: FC<AppBackendAccessHintsProps> = ({
  backendPathTemplate,
  appName,
  appHost,
}) => {
  return (
    <Box marginBottom={1} flexDirection="column">
      <Text bold color={infoColor}>
        🔧 Backend Access:
      </Text>
      <Text color="gray">
        {appHost
          ? `Your ${appName} backend is available at:`
          : `Once you connect a domain, your ${appName} backend will be available at:`}
      </Text>
      <Text color="gray">
        <Value>
          {backendPathTemplate.replace("{domain}", appHost ?? "<your-domain>")}
        </Value>
      </Text>
    </Box>
  );
};
