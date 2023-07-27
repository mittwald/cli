import { FC } from "react";
import { Value } from "../Value.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Text } from "ink";
import AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;
import AppAppVersion = MittwaldAPIV2.Components.Schemas.AppAppVersion;

export const AppInstallationStatus: FC<{
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
