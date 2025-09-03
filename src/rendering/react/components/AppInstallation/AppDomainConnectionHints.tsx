import React, { FC } from "react";
import { Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
import { Value } from "../Value.js";
import { CommandHint } from "../Container/CommandHint.js";

type AppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

interface AppDomainConnectionHintsProps {
  appInstallation: AppInstallation;
}

const infoColor = "blueBright";

/**
 * AppDomainConnectionHints displays instructions for connecting a domain to an
 * app installation via virtualhost creation.
 */
export const AppDomainConnectionHints: FC<AppDomainConnectionHintsProps> = ({
  appInstallation,
}) => {
  return (
    <>
      <Text bold color={infoColor}>
        🌐 Connect via Domain:
      </Text>
      <CommandHint
        command={[
          "mw",
          "domain",
          "virtualhost",
          "create",
          "--hostname",
          "<your-domain.com>",
          "--path-to-installation",
          `/:${appInstallation.id}`,
        ]}
        description={
          <>
            Connect <Value>{"<your-domain.com>"}</Value> to your app
            installation, making it accessible via HTTPS. This is required for
            external access to your application.
          </>
        }
      />
    </>
  );
};
