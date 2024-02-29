import { FC, ReactNode } from "react";
import { Header } from "../Header.js";
import {
  useSystemSoftware,
  useSystemSoftwareVersion,
} from "../../../../lib/app/hooks.js";
import { Value } from "../Value.js";
import { SingleResult } from "../SingleResult.js";
import { Text } from "ink";
import type { MittwaldAPIV2 } from "@mittwald/api-client";

type AppAppInstallation = MittwaldAPIV2.Components.Schemas.AppAppInstallation;

export const AppSystemSoftware: FC<{ appInstallation: AppAppInstallation }> = ({
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
