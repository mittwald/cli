import React, { FC, PropsWithChildren } from "react";
import maybe from "../../../../lib/util/maybe.js";
import { useVirtualHosts } from "../../../../lib/resources/domain/virtualhost/hooks.js";
import { Header } from "../Header.js";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import { Box, Text } from "ink";
import buildAppURLsFromIngressList from "../../../../lib/resources/app/buildAppURLsFromIngressList.js";

type AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

const AppVirtualHostBox: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Box flexDirection="column">
      <Box marginY={1}>
        <Header title="Linked virtual hosts" />
      </Box>
      {children}
    </Box>
  );
};

/**
 * Component to display the virtual hosts linked to an app installation. There
 * is no specific API endpoint to fetch this information, so we have to fetch
 * all virtual hosts and filter them by the installation ID.
 *
 * @class
 * @param appInstallation
 */
export const AppVirtualHosts: FC<{
  appInstallation: AppAppInstallation;
}> = ({ appInstallation }) => {
  const virtualHosts = maybe(useVirtualHosts)(appInstallation.projectId);

  if (!virtualHosts || virtualHosts.length === 0) {
    return (
      <AppVirtualHostBox>
        <Text>No virtual hosts are linked to this app installation</Text>
      </AppVirtualHostBox>
    );
  }

  const matchingURLs = buildAppURLsFromIngressList(
    virtualHosts,
    appInstallation.id,
  );

  return (
    <AppVirtualHostBox>
      {matchingURLs.map((url, idx) => (
        <Text key={idx}>{url}</Text>
      ))}
    </AppVirtualHostBox>
  );
};
