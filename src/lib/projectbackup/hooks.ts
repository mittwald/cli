import { useRenderContext } from "../../rendering/react/context.js";
import { usePromise } from "@mittwald/react-use-promise";
import { assertStatus } from "@mittwald/api-client-commons";
import { MittwaldAPIV2 } from "@mittwald/api-client";
import BackupProjectBackup = MittwaldAPIV2.Components.Schemas.BackupProjectBackup;
import BackupProjectBackupSchedule = MittwaldAPIV2.Components.Schemas.BackupProjectBackupSchedule;

export function useProjectBackup(projectBackupId: string): BackupProjectBackup {
  const { apiClient } = useRenderContext();
  const projectBackup = usePromise(
    (id) =>
      apiClient.backup.getProjectBackup({
        projectBackupId: id,
      }),
    [projectBackupId],
  );
  assertStatus(projectBackup, 200);

  return projectBackup.data;
}

export function useProjectBackupSchedule(
  projectBackupScheduleId: string,
): BackupProjectBackupSchedule {
  const { apiClient } = useRenderContext();
  const projectBackupSchedule = usePromise(
    (id) =>
      apiClient.backup.getProjectBackupSchedule({
        projectBackupScheduleId: id,
      }),
    [projectBackupScheduleId],
  );
  assertStatus(projectBackupSchedule, 200);

  return projectBackupSchedule.data;
}
