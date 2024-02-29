import { FC } from "react";
import type { MittwaldAPIV2 } from "@mittwald/api-client";
type BackupProjectBackup = MittwaldAPIV2.Components.Schemas.BackupProjectBackup;
import { Text } from "ink";

export const ProjectBackupStatus: FC<{
  projectBackup: BackupProjectBackup;
}> = ({ projectBackup }) => {
  if (projectBackup.status === "Completed") {
    return <Text color="green">✅ completed</Text>;
  }

  return <Text color="yellow">{projectBackup.status}</Text>;
};
